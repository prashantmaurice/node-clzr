var registry = global.registry;
var Q = require("q");
var util = registry.getSharedObject("util");

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var vendor_checkin_S0_predicates = {
    "limitedTime": function(user, vendor, offer) {
        var currentDate = new Date();
        var deferred = Q.defer();
        debugger;
        if(currentDate > offer.params.offerStart && currentDate < offer.params.offerEnd) {
            debugger;
            deferred.resolve(offer);
        }
        else {
            debugger;
            deferred.reject({});
        }
        return deferred.promise;
    },
    "limitedCustomers": function( user, vendor, offer) {
      debugger;
      var Checkin = require("./models").CheckIn;
      debugger;
      var deferred = Q.defer();
      Checkin.find({
        offer:offer._id
    }).exec().then(function(allCheckins) {
        debugger;
        if(allCheckins.length >= offer.params.maxCustomers) {
          debugger;
          deferred.resolve(false);
      }
      else {
        debugger;
        var checkinsByUser = _.filter(allCheckins, function(checkin) {
          return (checkin.user == user._id);
      });
        debugger;
        if(checkinsByUser.length == 0) {
          debugger;
          deferred.resolve(true);
      }
      else {
        deferred.resolve(false);
    }
}
});
    return deferred.promise;
}

}

var vendor_checkin_S0 = function( params, user, vendor, offer ){
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
                    checkinObj.vendor = params.vendor_id;
                    checkinObj.user = user._id;
                    checkinObj.offer = params.offer_id;
                    checkinObj.state = CHECKIN_STATE_ACTIVE;

                    checkinM.save( checkinObj ).then( function( checkin ){
                        deferred.resolve( checkin );
                    }, function( err ){
                        deferred.reject( err );
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
    // return vendor_predicate_S0[offer.type](user, vendor, offer);
    var deferred = Q.defer();
    deferred.resolve(Math.random()>0.5)
    return deferred.promise
}

var vendor_validate_S0 = function( params, vendor, user, checkin ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay

    var checkinM = registry.getSharedObject("data_checkin");
    checkinM.get( params ).then( function( checkin ){
        checkin.state = CHECKIN_STATE_CONFIRMED;
        return checkinM.save(params, checkin);
    }, function( err ){
        deferred.reject( err );
    }). then( function( checkin ){
        deferred.resolve( checkin );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

global.registry.register("handler_checkin_S0", {get:vendor_checkin_S0});
global.registry.register("handler_validate_S0", {get:vendor_validate_S0});
global.registry.register("handler_predicate_S0", {get:vendor_predicate_S0});
