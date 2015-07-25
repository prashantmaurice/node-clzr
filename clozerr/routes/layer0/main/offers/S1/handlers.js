var registry = global.registry;
var Q = require("q");
var hat = require("hat")

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var vendor_checkin_S1 = function( params, user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    debugger;
    var checkinObj = checkinM.create(params);

    var util = global.registry.getSharedObject("util");

    //TODO : Also if the checkin is not validated within 2 hrs, just cancel it i.e set its state to cancelled and save it
    
    return util.policyCheckDuplicateCheckins(user, vendor, offer).then(function(checkin) {
        if( checkin ) {
		return Q(checkin);
	}
        
        return util.policyCheckTimeDelayBetweenCheckins(user, vendor, offer)

    }).then(function(retval) {

	if( typeof retval != "Boolean" ){
		return Q(checkin);
	}

        var rack = hat.rack(10, 10);
        if( !retval ) {
		throw({code:546, error:"Minimum 2 hrs between checkins"});
	}
                    
	checkinObj.vendor = vendor._id;
        checkinObj.user = user._id;
       	checkinObj.offer = offer._id;
        checkinObj.state = CHECKIN_STATE_ACTIVE;
        checkinObj.date_created = new Date();
        checkinObj.pin=rack();
        checkinObj.gcm_id=params.gcm_id||0;
        return checkinObj.save();

     });
}

var vendor_predicate_S1 = function(user, vendor, offer) {

    if(!user.stamplist[vendor.fid]) {
        user.stamplist[vendor.fid] = 0;
    }

    if( (user.stamplist[vendor.fid]+1 >= offer.stamps*1) || ( vendor.visitOfferId && (offer._id.toString() == vendor.visitOfferId.toString()) ) ) {
        return Q(true);
    }
    else {
        return Q(false);
    }
}

var vendor_validate_S1 = function( vendor, user, checkin ){
    //TODO : Put a review scheduler for sending review push notification after some preset time delay

    //increase stamps

    //REMEMBER : user should be user object of vendor

    	console.log(user.stamplist);

    	checkin.state = CHECKIN_STATE_CONFIRMED;
    	console.log(checkin);
	// :O
    	checkin.save( function( res ){ console.log( res ) }, function(err) {
            //deferred.resolve({code:500,error:err});
            console.log( err );
        });
	
        if(!user.stamplist)
            user.stamplist={}

        if(!user.stamplist[vendor.fid])
            user.stamplist[vendor.fid] = 0

	console.log("validate_data");
	console.log(checkin.validate_data.stamps);
        
	user.stamplist[vendor.fid] = parseInt(user.stamplist[vendor.fid]) + parseInt( checkin.validate_data.stamps );
        user.markModified("stamplist");


        user.save( function( res ){ console.log( res ) }, function(err) {
            //deferred.resolve({code:500,error:err});
            console.log( err );
        });
	
        //registry.getSharedObject("analytics_checkin").get({},checkin,user);
        return Q(checkin);

}

global.registry.register("handler_checkin_S1", {get:vendor_checkin_S1});
global.registry.register("handler_validate_S1", {get:vendor_validate_S1});
global.registry.register("handler_predicate_S1", {get:vendor_predicate_S1});
