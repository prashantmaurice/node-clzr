
var Q = require("Q");
var registry = globals.registry;

var load_checkin = function( params, user ){
    var deferred = Q.defer();

    var Checkin = registry.get("models_Checkin");
    var Vendor = registry.get("models_Vendor");
    var User = registry.get("models_User");

    var checkin_obj = null;

    Checkin.findOne({
        _id: params.checkin_id
    }).exec().then( function( checkin ){
        checkin_obj = checkin.toJSON();
        return Vendor.findOne({
            _id: checkin_obj.vendor;
        });

    }, function(err){
        deferred.reject( err );        
    }).then(function( vendor ){
        checkin_obj.vendor = vendor;
        return User.findOne({
            _id: checkin_obj.vendor_id;
        });

    }, function(err){
        deferred.reject(err);
    }).then(function( user ){
        checkin_obj.user = user;

        deferred.resolve( obj );

    }, function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}
var create_checkin = function( params ){
    /*
     * Create a new checkin and return the checkin object.
     */
}

var save_checkin = function( params ){
    /*
     * Save the checkin. Do other stuff here that is to be done while checking in.
     */
}

registry.register("http_checkin", {get:load_checkin, save:save_checkin, create: create_checkin} );

