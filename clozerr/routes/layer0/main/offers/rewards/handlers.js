var registry = global.registry;
var Q = require("q");
var hat = require("hat")

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var handler_checkin_rewards = function( params, user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    debugger;
    var checkinObj = checkinM.create(params);

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
                        deferred.resolve({code:500,error:err});
                    });
                    deferred.resolve(checkinObj);
                }
                else {
                        deferred.resolve({code:204,error:'checkin time delay error'});
                    }
                }, function(err) {
                    deferred.resolve({code:500,error:err});
                });
        }
    }, function(err) {
        deferred.resolve({code:500,error:err});
    });

return deferred.promise;
}

var handler_predicate_rewards = function(user, vendor, offer) {
    //TODO : type specific handlers
    var deferred = Q.defer();
        var Checkinr=registry.getSharedObject("data_checkins");
        Checkin.get({
            "user":user.id,
            "offer":offer.id,
            "state":{$in:[CHECKIN_STATE_ACTIVE,CHECKIN_STATE_CONFIRMED]}
        }).then(function(checkins){
            if(!checkins || checkins.length==1)
                deferred.resolve(true)
            else
                deferred.resolve(false)
        })
        return deferred.promise;
}

var handler_validate_rewards = function( vendor, user, checkin ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay
    debugger;
    checkin.state = CHECKIN_STATE_CONFIRMED;
    checkin.save(function(err) {
        deferred.resolve({code:500,error:err});
    });
    deferred.resolve(checkin);

    return deferred.promise;
}

global.registry.register("handler_checkin_rewards", {get:handler_checkin_rewards});
global.registry.register("handler_validate_rewards", {get:handler_validate_rewards});
global.registry.register("handler_predicate_rewards", {get:handler_predicate_rewards});
