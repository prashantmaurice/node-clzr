var registry = global.registry;
var Q = require("q");
var _ = require("underscore")
var hat = require("hat")

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
        if(currentDate > offer.params.startDateTime && currentDate < offer.params.endDateTime) {
            deferred.resolve(true);
        }
        else {
            deferred.resolve(false);
        }
        return deferred.promise;
    },
    "limitedCustomer": function( user, vendor, offer) {
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
    "happyHour": function(user,vendor,offer){
        var days=offer.params.days; //array containing 0-6 , 0 => Sunday
        var startHour=offer.params.startHour;//hours in 0-23
        var endHour=offer.params.endHour;//inclusive of end hour
        var date=new Date();
        console.log(date.getDay(),date.getHours())
        return Q(_.contains(days,date.getDay()) && date.getHours()<=endHour && date.getHours()>=startHour)
    },
    "welcome": function(user,vendor,offer){
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
                var rack = hat.rack(10, 10);
                if(retval) {
                    checkinObj.vendor = vendor._id;
                    checkinObj.user = user._id;
                    checkinObj.offer = offer._id;
                    checkinObj.state = CHECKIN_STATE_ACTIVE;
                    checkinObj.date_created = new Date();
                    checkinObj.pin=rack();
                    checkinObj.gcm_id=params.gcm_id||0;
                    console.log("saving checkin");
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

var vendor_predicate_S0 = function(user, vendor, offer) {
    var s0_types=['limitedTime','limitedCustomer','happyHour','welcome']

    if(!offer.params ||!offer.params.type){
        console.log('no params or params.type for offer'+JSON.stringify(offer))
        return Q(false)
    }
    if(s0_types.indexOf(offer.params.type)==-1){
      console.log('wrong params.type for offer'+JSON>stringify(offer))
      return Q(false);
    }
    return vendor_checkin_S0_predicates[offer.params.type](user, vendor, offer);
}

var vendor_validate_S0 = function( vendor, user, checkin ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay
    debugger;
    checkin.state = CHECKIN_STATE_CONFIRMED;
    registry.getSharedObject("util_session").get({user_id:checkin.user}).then(function(user) {
        if(!user.stamplist)
            user.stamplist=[]
        if(!user.stamplist[vendor.fid])
            user.stamplist[vendor.fid]=1
        else {
            user.stamplist[vendor.fid]+=1
        }
        user.markModified('stamplist')
        user.save();
    })
    checkin.save(function(err) {
        deferred.resolve({code:500,error:err});
    });
    deferred.resolve(checkin);

    return deferred.promise;
}

global.registry.register("handler_checkin_S0", {get:vendor_checkin_S0});
global.registry.register("handler_validate_S0", {get:vendor_validate_S0});
global.registry.register("handler_predicate_S0", {get:vendor_predicate_S0});
