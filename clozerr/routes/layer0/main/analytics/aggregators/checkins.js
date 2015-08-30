
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

var analytics_installs_byDay = function(){
	var mapReduce = registry.getSharedObject("analytics_mapreduce");
	
	var req = {
	
		dimensions: [],
		time_interval: 1000 * 60 * 60 * 12,
		query:{ metric:"url_auth_login", "dimensions.created":true }

	}

	return mapReduce.get( req ).then( function( records ){
        return _.map( records, function( record ){
            if( record._id.time )
                record._id.time_string = new Date( record._id.time ).toString();
            return record;
        } );
    } );
}

registry.register("analytics_checkins", { all: analytics_checkins_all, today: analytics_checkins_today } );



