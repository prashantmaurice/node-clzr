
var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var https = require("https");

var analytics_checkins_all = function(){

	var eventsM = registry.getSharedObject("models_Analytics");
	var checkinsM = registry.getSharedObject("models_Checkin");

	//return eventsM.find({ metric:"url_auth_login", "dimensions.created":true }).count();
	return checkinsM.find({ state:1 }).count();

}

var analytics_checkins_today = function(){

	var eventsM = registry.getSharedObject("models_Analytics");
	
	var date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	
	var checkinsM = registry.getSharedObject("models_Checkin");

	//return eventsM.find({ metric:"url_auth_login", "dimensions.created":true }).count();
	return checkinsM.find({ state:1, date_created:{ $gte:date } }).count();

}

registry.register("analytics_checkins", { all: analytics_checkins_all, today: analytics_checkins_today } );



