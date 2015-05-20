var registry = global.registry;
var Q = require("q");

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

var vendor_checkin_S0 = function( params, vendor, user ){
    var deferred = Q.defer();
    /*
     * Create a temporary checkin object with any required state data.
     * must have vendor: vendor_id and user: user_id. otherwise won't work.
     *
     * */
     var checkinM = registry.getSharedObject("data_checkin");
     var checkinObj = checkinM.create();

    // TODO: Put checkin object parameters here.

    checkinObj.vendor = params.vendor_id;
    checkinObj.user = user._id;
    checkinObj.offer = params.offer_id;

    vendor_checkin_S0_predicates[""]
    
    checkinM.save( checkinObj ).then( function( checkin ){
        deferred.resolve( checkin );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

var vendor_predicate_S0 = function(user, vendor, offer) {
    return vendor_predicate_S0[offer.type](user, vendor, offer);
}

var vendor_validate_S0 = function( params, vendor, user, checkin ){
    var deferred = Q.defer();
    /*
     * Validate the checkin and change the state of the user to point
     * to the new state
     * eg: update the stamplist etc.
     */
     var checkinM = registry.getSharedObject("data_checkin");
     checkinM.get( params ).then( function( checkin ){
        //TODO: Validate the checkin here.
        
        return checkinM.save();
    }, function( err ){
        deferred.reject( err );
    }).then( function( checkin ){
        deferred.resolve( checkin );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

global.registry.register("handler_checkin_S0", {get:vendor_checkin_S0});
global.registry.register("handler_validate_S0", {get:vendor_validate_S0});
global.registry.register("handler_predicate_S0", {get:vendor_predicate_S0});
