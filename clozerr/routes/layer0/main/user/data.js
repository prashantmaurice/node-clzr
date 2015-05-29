var registry = global.registry;
var Q = require("q");

var data_user = function( params ){
    // Get all relevant fields for the User object.
    var deferred = Q.defer();
    var User = registry.getSharedObject("models_User");
    var criteria = { _id: params.user_id };
    debugger;

    User.findOne( criteria ).exec().then( function( result ){
        debugger;
        deferred.resolve( result );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

registry.register('util_session', {get:data_user});

var data_user_token = function( params ){
     var deferred = Q.defer();
    var access_token = params.access_token;
    var curr_token=null;
    
    var User = registry.getSharedObject("models_User");
    var Token = registry.getSharedObject("models_Token");

    Token.findOne( { access_token: access_token } ).exec()
    .then( function( token ){
        curr_token=token.toJSON();
        return User.findOne({_id:curr_token.account}).exec();
    }, function(err){
        deferred.reject( err )
    })
    .then( function( user ){
        deferred.resolve( user );
    }, function( err ){
        deferred.reject( err );
    });
    return deferred.promise;
}
   
registry.register('live_session',{get:data_user_token});
