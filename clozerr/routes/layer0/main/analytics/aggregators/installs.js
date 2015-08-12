
var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var https = require("https");

var analytics_installs_all = function(){

	var eventsM = registry.getSharedObject("models_Analytics");
	var usersM = registry.getSharedObject("models_User");

	//return eventsM.find({ metric:"url_auth_login", "dimensions.created":true }).count();
	return usersM.find({ profile:{$exists:true} }).count();

}

var analytics_installs_today = function(){

	var eventsM = registry.getSharedObject("models_Analytics");
	
	var date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	
	return eventsM.find({ metric:"url_auth_login", "dimensions.created":true, timeStamp:{ $gte: date } }).count();

}

var analytics_installs_byDay = function(){
	var mapReduce = registry.getSharedObject("analytics_mapreduce");
	
	var req = {
	
		dimensions: [],
		time_interval: 1000 * 60 * 60 * 24,
		query:{ metric:"url_auth_login", created:true },

	}

	return mapReduce.get( req );
}



registry.register("analytics_installs", { all: analytics_installs_all, today: analytics_installs_today, byDay: analytics_installs_byDay } );



