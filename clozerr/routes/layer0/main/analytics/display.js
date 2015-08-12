
var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var https = require("https");

var analytics_admin_view = {
    "Clozerr_Home_Screen" : function( obj ){
		return { caption:"Home page hit.", description:"Home page hit.", raw:obj };
    },
	"url_vendor_search_near" : function( obj ){

		https.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + obj.dimensions.latitude + ","+ obj.dimensions.longitude + ",80.67&sensor=false", function( response ){
	
			response.on("data", function( dat ){
				var obj = JSON.parse( dat.toString() );
				user.profile = obj;
				user.markModified("profile");
				user.upgraded = new Date();
				cb( user );
			});

		});
	},
    "default": function( obj ){
        return { caption:"Display failed.", description:"Analytics display for metric '" + obj.metric + "' is missing. Add a display in analytics/display.js to handle this metric.", raw:obj };
    }
}

registry.register("analytics_admin_view", analytics_admin_view);
