var registry = global.registry;
var Q = require("q");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var vendor_checkin_SX = function( user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    var checkinObj = checkinM.create();

    //TODO : Also if the checkin is not validated within 2 hrs, just cancel it i.e set its state to cancelled and save it

    util.policyCheckDuplicateCheckins(user, vendor, offer).then(function(checkin) {
        if(checkin) {
            deferred.resolve(checkin);
        }
        else {
            util.policyCheckTimeDelayBetweenCheckins(user, vendor, offer).then(function(retval, checkin) {
                if(retval) {
                    checkinObj.vendor = vendor._id;
                    checkinObj.user = user._id;
                    checkinObj.offer = offer._id;
                    checkinObj.state = CHECKIN_STATE_ACTIVE;

                    checkinM.save( checkinObj ).then( function( checkin ){
                        deferred.resolve( checkin );
                    }, function( err ){
                        deferred.reject( err );
                    });
                }
                else {
                    deferred.resolve("{error:invalid checkin}")
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
        user.save();
    }

    if(user.stamplist[vendor.fid] >= offer.stamps) {
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

    var stamps = (checkin.validate_data.billAmt*1)/(vendor.settings.billAmt*1);

    

    if(user.type == "Vendor" && checkin.vendor_id == vendor._id && vendor.offers.contains(ObjectId(checkin.offer_id))) {
        checkin.state = CHECKIN_STATE_CONFIRMED;
        checkin.save(function(err) {
            deferred.reject(err);
        });
        user.stamplist[vendor.fid] += stamps*1;
    user.save();
        deferred.resolve(checkin);
    }
    else {
        deferred.resolve();
    }

    return deferred.promise;
}

global.registry.register("handler_checkin_SX", {get:vendor_checkin_SX});
global.registry.register("handler_validate_SX", {get:vendor_validate_SX});
global.registry.register("handler_predicate_SX", {get:vendor_predicate_SX});