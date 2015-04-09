var registry = global.registry;
var Q = require("q");

var vendor_checkin_S1 = function( params, vendor, user ){
    var deferred = Q.defer();
    /*
     * Create a temporary checkin object with any required state data.
     * must have vendor: vendor_id and user: user_id. otherwise won't work.
     *
     * */
    var checkinM = registry.getSharedObject("http_checkin");
    var checkinObj = checkinMethods.create();

    // TODO: Put checkin object parameters here.
    
    checkinM.save( checkinObj ).then( function( checkin ){
        deferred.resolve( checkin );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

var vendor_validate_S1 = function( params, vendor, user, checkin ){
    var deferred = Q.defer();
    /*
     * Validate the checkin and change the state of the user to point
     * to the new state
     * eg: update the stamplist etc.
     */
    var checkinM = registry.getSharedObject("http_checkin");
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

global.registry.register("handler_checkin_S1", {get:vendor_checkin_S1});
global.registry.register("handler_validate_S1", {get:vendor_validate_S1});
