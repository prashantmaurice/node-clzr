var registry = global.registry;
var Q = require("q");
var _ = require("underscore")

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var vendor_checkin_S0_predicates = {
    "limitedTime": function(user, vendor, offer) {
        var currentDate = new Date();
        var deferred = Q.defer();
        if(currentDate > offer.params.offerStart && currentDate < offer.params.offerEnd) {
            deferred.resolve(true);
        }
        else {
            deferred.resolve(false);
        }
        return deferred.promise;
    },
    "limitedCustomers": function( user, vendor, offer) {
        var deferred = Q.defer();
        var CheckinByVendor=registry.getSharedObject("data_checkins");
        CheckinByVendor.get({
            "offer":offer.id,
            "state":{$in:[CHECKIN_STATE_ACTIVE,CHECKIN_STATE_CONFIRMED]}
        }).then(function(checkins){
            if(checkins.length<(offer.params.maxCustomers || 0)){
                if(_.find(checkins,function(ch){ch.user==user.id}))
                    deferred.resolve(false)
                else
                    deferred.resolve(true)
            }
            else
                deferred.resolve(false)
        })
        return deferred.promise;
    },
    "happyHours": function(user,vendor,offer){
        var days=offer.params.days; //array containing 0-6 , 0 => Sunday
        var startHour=offer.params.startHour;//hours in 0-23
        var endHour=offer.params.endHour;//inclusive of end hour
        var date=new Date();
        console.log(date.getDay(),date.getHours())
        return Q(_.contains(days,date.getDay()) && date.getHours()<=endHour && date.getHours()>=startHour)
    },
    "welcomeReward": function(user,vendor,offer){
        //TODO: are we initializing to zero or one?
        return Q((!user.stamplist)||(!user.stamplist[vendor.fid])||(user.stamplist[vendor.fid]==0))
    }
}

var vendor_checkin_S0 = function( params,user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    var checkinObj = checkinM.create();

    //TODO : Also if the checkin is not validated within 2 hrs, just cancel it i.e set its state to cancelled and save it

    registry.getSharedObject("util").policyCheckDuplicateCheckins(user, vendor, offer).then(function(checkin) {
        if(checkin) {
            deferred.resolve(checkin);
        }
        else {
            registry.getSharedObject("util").policyCheckTimeDelayBetweenCheckins(user, vendor, offer).then(function(retval) {
                debugger;
                if(retval) {
                    checkinObj.vendor = vendor._id;
                    checkinObj.user = user._id;
                    checkinObj.offer = offer._id;
                    checkinObj.state = CHECKIN_STATE_ACTIVE;

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

var vendor_predicate_S0 = function(user, vendor, offer) {
    return vendor_checkin_S0_predicates[offer.params.type](user, vendor, offer);
}

var vendor_validate_S0 = function( vendor, user, checkin ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay
    debugger;
    checkin.state = CHECKIN_STATE_CONFIRMED;
    checkin.save(function(err) {
        deferred.reject(err);
    });
    deferred.resolve(checkin);

    return deferred.promise;
}

global.registry.register("handler_checkin_S0", {get:vendor_checkin_S0});
global.registry.register("handler_validate_S0", {get:vendor_validate_S0});
global.registry.register("handler_predicate_S0", {get:vendor_predicate_S0});
