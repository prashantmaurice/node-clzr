var registry = global.registry;
var Q = require("q");
var _ = require("underscore")
var hat = require("hat")

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;


var vendor_checkin_S0 = function( params,user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    var checkinObj = checkinM.create();

    //TODO : Also if the checkin is not validated within 2 hrs, just cancel it i.e set its state to cancelled and save it
    //TODO : Check for predicates.
    var context = {user:user, params:params};

    return registry.getSharedObject("util").policyCheckDuplicateCheckins(user, vendor, offer).then(function(checkin) {
        console.log("Duplicate cehck finished");
	if(checkin) {
            return Q(checkin);
        }
        
        return registry.getSharedObject("util").policyCheckTimeDelayBetweenCheckins(user, vendor, offer);
	
    }).then(function(retval) {

	// Pass value through.	

	if( typeof retval != "Boolean" ){
		return Q(checkin);
	}
    	var rack = hat.rack(10, 10);
        if(!retval) {
		throw { code:437, description:"Time delay between checkins required" };
	}
        checkinObj.vendor = vendor._id;
        checkinObj.user = user._id;
        checkinObj.offer = offer._id;
        checkinObj.state = CHECKIN_STATE_ACTIVE;
        checkinObj.date_created = new Date();
        checkinObj.pin=rack();
        checkinObj.gcm_id=params.gcm_id||0;
        console.log("saving checkin");
        return checkinObj.save();
    });

}

var vendor_predicate_S0 = function(user, vendor, offer) {
    debugger;
    var vendor_checkin_S0_predicates = registry.getSharedObject("checkin_S0_predicates");
    var s0_types = _.keys( vendor_checkin_S0_predicates );

    if(!offer.params ||!offer.params.type){
        console.log('no params or params.type for offer'+JSON.stringify(offer))
        return Q(false)
    }
    if(s0_types.indexOf(offer.params.type)==-1){
      console.log('wrong params.type for offer'+JSON.stringify(offer));
      return Q(false);
    }
    //var vendor_checkin_S0_predicates = registry.getSharedObject("checkin_S0_predicates");
    return vendor_checkin_S0_predicates[offer.params.type](user, vendor, offer);
}

var vendor_validate_S0 = function( vendor, user, checkin, offer ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay
    checkin.state = CHECKIN_STATE_CONFIRMED;
    
    return registry.getSharedObject("util_session").get({user_id:checkin.user}).then(function(user) {
        if(!user.stamplist)
            user.stamplist=[]
        if(!user.stamplist[vendor.fid])
            user.stamplist[vendor.fid]= parseInt( checkin.validate_data.stamps );
        else {
            user.stamplist[vendor.fid]+= parseInt(user.stamplist[vendor.fid]) + parseInt(checkin.validate_data.stamps);
        }
        user.markModified('stamplist')

	console.log("checking for rewards..");
	console.log( offer );
	// Handle the case of offers being exclusive.
        if( offer.vendor && user.rewards ){
		console.log("removing reward");
		
		var idx = user.rewards.indexOf( checkin.offer );
	
		if( idx != -1 )
			user.rewards.splice( idx, 1 );

		user.markModified("rewards");
	}
	console.log("Checkin validated");
	return user.save();

    }).then(function( user ){

    	return checkin.save();

    });

    

}

global.registry.register("handler_checkin_S0", {get:vendor_checkin_S0});
global.registry.register("handler_validate_S0", {get:vendor_validate_S0});
global.registry.register("handler_predicate_S0", {get:vendor_predicate_S0});
