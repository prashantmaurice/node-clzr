
var Q = require("q");
var registry = global.registry;
var _ = require("underscore");

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
        deferred.resolve({code:500,error:err});    
    }).then(function( vendor ){
        checkin_obj.vendor = vendor;
        return User.findOne({
            _id: checkin_obj.user
        }).exec();

    }, function(err){
        deferred.resolve({code:500,error:err});
    }).then(function( user ){
        checkin_obj.user = user;
        console.log( "checkin stamps: " + user.stamplist[ checkin_obj.vendor.fid ] || 0 );
		//checkin_obj.current_stamps = user.stamplist[ checkin_obj.vendor.fid ] || 0;
		
		deferred.resolve( checkin_obj );

    }, function(err){
        deferred.resolve({code:500,error:err});
    });

    return deferred.promise;
}

var data_load_checkin_with_params = function( params ){
   

    var Checkin = registry.getSharedObject("models_Checkin");
    var Vendor = registry.getSharedObject("models_Vendor");
    var User = registry.getSharedObject("models_User");
    var Offer = registry.getSharedObject("models_Offer");

    params.limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    params.offset=params.offset || 0;

    

    return Q( Checkin.find(params.criteria).limit(params.limit).skip(params.offset).sort("-date_created").exec().then(function(checkins) {
		var plist = _.map( checkins, function( checkin ){
            var checkin_obj = { _id:checkin._id, pin:checkin.pin, date_created:checkin.date_created, raw:checkin };
        
            return Vendor.findOne({_id:checkin.vendor}).exec().then(function(vendor) {
                //debugger;
                checkin_obj.vendor = vendor;
                return Offer.findOne({_id:checkin.offer}).exec();
            }).then(function(offer) {
                //debugger;
                checkin_obj.offer = offer;
                return User.findOne({_id:checkin.user}).exec();
            }).then(function(user) {
                //debugger;
                checkin_obj.user = user;
				console.log( "checkin stamps: " + user.stamplist[ checkin_obj.vendor.fid ] || 0 );
				checkin_obj.current_stamps = user.stamplist[ checkin_obj.vendor.fid ] || 0;
            
				return Checkin.count({ user: user._id, vendor: checkin_obj.vendor._id, state:1 });
			}).then( function( numVisits ){
				//debugger;
				console.log("Visit no: " + (numVisits + 1));

				checkin_obj.current_visits = (numVisits + 1);

				
				return Checkin.count({ user: checkin_obj.user._id, vendor: checkin_obj.vendor._id, state:1, date_created:{$lte: checkin.date_created} });
            }).then( function( visitNum ){
				checkin_obj.visit_num = visitNum;
				return Q(checkin_obj);
			});
//            plist.push(pr);
		
        });

        return Q.all(plist);
    }) );

    //return deferred.promise;
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
