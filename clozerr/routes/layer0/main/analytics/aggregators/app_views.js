
var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var https = require("https");

var analytics_appviews_all = function(){

	var eventsM = registry.getSharedObject("models_Analytics");
	//var usersM = registry.getSharedObject("models_User");

	return eventsM.find({ metric:"url_vendor_search_near" }).count();
	//return usersM.find({ profile:{$exists:true} }).count();

}

var analytics_appviews_today = function(){

	var eventsM = registry.getSharedObject("models_Analytics");
	
	var date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	
	return eventsM.find({ metric:"url_vendor_search_near", timeStamp:{ $gte: date } }).count();

}

registry.register("analytics_appviews", { all: analytics_appviews_all, today: analytics_appviews_today } );

