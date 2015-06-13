var registry = global.registry;
var Q = require("q");
var hat = require("hat")

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var vendor_checkin_SX = function( params, user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    debugger;

    var checkinObj = checkinM.create();

    var util = global.registry.getSharedObject("util");

    //TODO : Also if the checkin is not validated within 2 hrs, just cancel it i.e set its state to cancelled and save it
    debugger;
    util.policyCheckDuplicateCheckins(user, vendor, offer).then(function(checkin) {
        if(checkin) {
            debugger;
            deferred.resolve(checkin);
        }
        else {
            debugger;
            util.policyCheckTimeDelayBetweenCheckins(user, vendor, offer).then(function(retval) {
                debugger;
                var rack = hat.rack(10, 10);
                if(retval) {
                    checkinObj.vendor = vendor._id;
                    checkinObj.user = user._id;
                    checkinObj.offer = offer._id;
                    checkinObj.state = CHECKIN_STATE_ACTIVE;
                    checkinObj.date_created = new Date();
                    checkinObj.pin=rack();
                    checkinObj.gcm_id=params.gcm_id||0;
                    checkinObj.save(function(err) {
                        deferred.reject(err);
                    });
                }
                else {
                        //TODO : throw error here.. can't use that offer
                        //deferred.reject(err);
                    }
                }, function(err) {
                    deferred.reject(err);
                });
        }
    }, function(err) {
        deferred.reject(err);
    });

return deferred.promise;
}

var vendor_predicate_SX = function(user, vendor, offer) {
    var deferred = Q.defer();

    if(!user.stamplist[vendor.fid]) {
        user.stamplist[vendor.fid] = 0;
        user.markModified("stamplist");
        user.save();
    }
    
    if(user.stamplist[vendor.fid] >= offer.stamps || (offer._id == vendor.visitOfferId)) {
        deferred.resolve(true);
    }
    else {
        deferred.resolve(false);
    }

    return deferred.promise;
}

var vendor_validate_SX = function( vendor, user, checkin ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay

    //increase stamps

    registry.getSharedObject("util_session").get({user_id:checkin.user}).then(function(userObj) {
        debugger;
          
        checkin.state = CHECKIN_STATE_CONFIRMED;
        debugger;

        checkin.save(function(err) {
            deferred.reject(err);
        });

        var stamps = (checkin.validate_data.billAmt*1)/(vendor.settings.billAmt*1);

        userObj.stamplist[vendor.fid] += stamps*1;
        userObj.markModified("stamplist");

        debugger;

        userObj.save(function(err) {
            deferred.reject(err);
        });

        deferred.resolve(checkin);
    });

    return deferred.promise;
}

global.registry.register("handler_checkin_SX", {get:vendor_checkin_SX});
global.registry.register("handler_validate_SX", {get:vendor_validate_SX});
global.registry.register("handler_predicate_SX", {get:vendor_predicate_SX});
