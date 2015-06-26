
var Q = require("q");
var registry = global.registry;

var load_checkin = function( params ){
    var deferred = Q.defer();

    var Checkin = registry.getSharedObject("models_Checkin");
    var Vendor = registry.getSharedObject("models_Vendor");
    var User = registry.getSharedObject("models_User");

    var checkin_obj = null;

    debugger;

    Checkin.findOne({
        _id: params.checkin_id
    }).exec().then( function( checkin ){
        debugger;
        checkin_obj = checkin.toJSON();
        return Vendor.findOne({
            _id: checkin_obj.vendor
        }).exec();

    }, function(err){
        deferred.reject( err );        
    }).then(function( vendor ){
        checkin_obj.vendor = vendor;
        return User.findOne({
            _id: checkin_obj.user
        }).exec();

    }, function(err){
        deferred.reject(err);
    }).then(function( user ){
        checkin_obj.user = user;

        deferred.resolve( checkin_obj );

    }, function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}

var data_load_checkin_with_params = function( params ){
    var deferred = Q.defer();

    var Checkin = registry.getSharedObject("models_Checkin");
    var Vendor = registry.getSharedObject("models_Vendor");
    var User = registry.getSharedObject("models_User");
    var Offer = registry.getSharedObject("models_Offer");

    params.limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    params.offset=params.offset || 0;

    debugger;

    Checkin.find(params.criteria).limit(params.limit).skip(params.offset).exec().then(function(checkins) {
        debugger;
        var plist = [];

        for(var i=0;i<checkins.length;i++) {
            var checkin = checkins[i];
            var checkin_obj = {};
            debugger;
            var pr = Vendor.findOne({_id:checkin.vendor}).exec().then(function(vendor) {
                debugger;
                checkin_obj.vendor = vendor;
                return Offer.findOne({_id:checkin.offer}).exec();
            }).then(function(offer) {
                debugger;
                checkin_obj.offer = offer;
                return User.findOne({_id:checkin.user}).exec();
            }).then(function(user) {
                debugger;
                checkin_obj.user = user;
                debugger;
                return Q(checkin_obj);
            });

            debugger;
            plist.push(pr);
        }

        Q.all(plist).then(function(checkins_with_details) {
            debugger;
            deferred.resolve(checkins_with_details);
        });
    });

    return deferred.promise;
}

var data_checkins = function(params){
    var Checkin = registry.getSharedObject("models_Checkin");
    return Checkin.find(params).exec()
}
var create_checkin = function( params ){
    /*
     * Create a new checkin and return the checkin object.
     * No need to use promises for this, no parallel IO necessary.
     */
     debugger;
     var Checkin = registry.getSharedObject("models_Checkin");
     debugger;
     return new Checkin();
 }

 var save_checkin = function( params, checkin ){
    /*
     * Save the checkin. Do other stuff here that is to be done while checking in.
     */
     return checkin.save();
 }

 registry.register("data_checkin", {get:load_checkin, save:save_checkin, create: create_checkin} );
 registry.register("data_checkins", {get: data_checkins});
 global.registry.register("data_checkin_params", {get:data_load_checkin_with_params});