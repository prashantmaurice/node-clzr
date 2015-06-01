
var Q = require("q");
var registry = global.registry;

var data_create_freebie = function( params ){
    // Make a freebie.   
}

var data_freebie = function( params ){
    //Fetch a freebie from the backend and populate it with the required data/links
    //so that it can be processed further.
    var deferred = Q.defer();

    var id = params._id;
    var Checkin = registry.get("models_Checkin");

    Checkin.findOne({
    	_id:id
    }).then(function(freebie) {
    	deferred.resolve(freebie);
    }, function(err) {
    	deferred.reject(err);
    });

    return deferred.promise;
}

var data_freebie_save = function( params ){

}

registry.register("data_freebie", {get:data_freebie, save:data_freebie_save, create: data_create_freebie} );
