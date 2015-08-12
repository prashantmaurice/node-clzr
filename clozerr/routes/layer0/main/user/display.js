var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var display_user_clubmember = function( user, vendor ){
	
	user = user.toJSON();

	// Set stamps to let the frontend know what's going on.
	// Case 2 shouls never actually happen, but maintain correctness.
	user.stamps = user.stamplist[vendor.fid] || 0;

	// Remove stamplist to hide personal details of other vendors.
	user.stamplist = [];

	
	// Get the latest successful checkin by the user.
	var Checkin = registry.getSharedObject("models_Checkin");
	console.log("GENTAG")
	console.log(user);
	console.log(vendor);
	return Checkin.findOne({ user: user._id, vendor: vendor._id, state: 1 }).sort("-date_created").then( function( checkin ){

		if( !checkin )
			user.latest_checkin = {};
		else
			user.latest_checkin = checkin.toJSON();
		
		return Q(user);

	});

} 

registry.register('display_user_clubmember',{ make: display_user_clubmember });
