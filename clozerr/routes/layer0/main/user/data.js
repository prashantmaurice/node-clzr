var registry = global.registry;
var Q = require("q");

var data_user = function( params ){
    // Get all relevant fields for the User object.
    var deferred = Q.defer();
    var User = registry.getSharedObject("models_User");
    var criteria = { _id: params.user_id };

    User.findOne( criteria ).exec().then( function( result ){
        debugger;
        deferred.resolve( result );
    }, function( err ){
        deferred.resolve( err );
    });

    return deferred.promise;
}

registry.register('util_session', {get:data_user});

var data_user_token = function( params ){
    var token = params.access_token;
    
    var User = registry.getSharedObject("models_User");
    var Token = registry.getSharedObject("models_Token");

    Token.findOne( { access_token: token } )
    .then( function( token ){
        return User.findOne({_id:token.account});
    }, function(err){
        deferred.reject( err )
    })
    .then( function( user ){
        deferred.resolve( user );
    }, function( err ){
        deferred.resolve( err );
    });
}