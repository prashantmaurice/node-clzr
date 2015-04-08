
var Q = require("Q");
var registry = globals.registry;

var handle_freebie_checkin = function( params, user, vendor ){
    var deferred = Q.defer();
    // Make a freebie checkin.
    var checkinM = registry.getSharedObject("data_checkin_list");
    var freebieM = registry.getSharedObject("data_freebie");

    var checkin = checkinM.create();

    checkin.vendor = vendor;
    checkin.user = user;
    
    var _id = params.freebie_id;
    freebieM.get( {_id:_id} ).then( function( freebie ){

        // do some freebie checking here.

        checkin.type = 2;// some code to indicate a freebie.
        checkin.freebie_id = freebie._id;
        
        checkin.save().then( function( res ){ deferred.resolve(res) }, function( err ){ deferred.reject( err ); } );

    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;

}

var handle_freebie_validate = function( params ){
    
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin_list");
    var id = params.checkin_id;

    checkinM.get( { _id: id } ).then( function( checkin ){
        // Validate the checkin here.
        checkin.save();
        deferred.resolve( checkin );
    }, function( err ){
        deferred.reject( err );
    } );
    // Validate the given checkin.
    // Use a data module to load the checkin object. or use the default http_checkin for this.
    return deferred.promise;

}

var handle_freebie_list = function( params, vendor, user ){
    var deferred = Q.defer();
    // Return a list of freebies that can be used by this user at this vendor.
    return deferred.promise;
}

registry.register("handle_freebie_validate", { get: handle_freebie_validate});
registry.register("handle_freebie_list",{ get: handle_freebie_list} );
registry.register("handle_freebie_checkin", { get: handle_freebiew_checkin } );
