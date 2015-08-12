
var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var registry = global.registry;
var _ = require("underscore");
var Q = require("q");
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
		console.log("happyHour reward predicate");
        var days=offer.params.days; //array containing 0-6 , 0 => Sunday
        var startHour=offer.params.startHour;//hours in 0-23
        var endHour=offer.params.endHour;//inclusive of end hour
        var date=new Date();
        //console.log(date.getDay(),date.getHours())
        //console.log( days );
		//console.log( _.contains( days, date.getDay()+'' ) )
		return Q(_.contains(days,date.getDay()+'') && date.getHours()<parseInt(endHour) && date.getHours()>=parseInt(startHour))
    },
    "welcomeReward": function(user,vendor,offer){
        //TODO: are we initializing to zero or one?
        return Q((!user.stamplist)||(!user.stamplist[vendor.fid])||(user.stamplist[vendor.fid]==0))
    },
    "noOffer": function(){ return Q(true); }
}


vendor_checkin_S0_predicates["welcome"] = vendor_checkin_S0_predicates["welcomeReward"];
vendor_checkin_S0_predicates["happyHours"] = vendor_checkin_S0_predicates["happyHour"];

registry.register("checkin_S0_predicates",vendor_checkin_S0_predicates);
