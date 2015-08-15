var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

/*
 * Aggregate 1 dimensional reports.
 **/
var admin_1D_reports = function(){
	var report = {
		"installs" : registry.getSharedObject("analytics_installs").all(),
		"installs_today" : registry.getSharedObject("analytics_installs").today(),
		"checkins" : registry.getSharedObject("analytics_checkins").all(),
		"checkins_today" : registry.getSharedObject("analytics_checkins").today(),
//		"beacons" : registry.getSharedObject("analytics_beacons").all(),
//		"beacons_today" : registry.getSharedObject("analytics_beacons").today(),
		"app_views" : registry.getSharedObject("analytics_appviews").all(),
		"app_views_today" : registry.getSharedObject("analytics_appviews").today(),
	};

	var promises = _.values( report );
	
	return Q.all( promises ).then( function( data ){
		return _.zip( _.keys( report ), data );	
	});
	
}

/*
 * Aggregate 2 dimensional reports.
 */
var admin_2D_reports = function(){
	
	var report = {
		"installs" : registry.getSharedObject("analytics_installs").byDay(),
//		"installs_today" : registry.getSharedObject("analytics_installs").today(),
//		"checkins" : registry.getSharedObject("analytics_checkins").byDay(),
//		"checkins_today" : registry.getSharedObject("analytics_checkins").today(),
//		"beacons" : registry.getSharedObject("analytics_beacons").all(),
//		"beacons_today" : registry.getSharedObject("analytics_beacons").today(),
		"app_views" : registry.getSharedObject("analytics_appviews").byDay(),
//		"app_views_today" : registry.getSharedObject("analytics_appviews").today(),
	};

	var promises = _.values( report );
	function toObject(names, values) {
		var result = {};
	    for (var i = 0; i < names.length; i++)
		        result[names[i]] = values[i];
		return result;
	}

	return Q.all( promises ).then( function( data ){
		return toObject( _.keys( report ), data );	
	});
}

registry.register("admin_1D_reports", {get:admin_1D_reports});
registry.register("admin_2D_reports", {get:admin_2D_reports});
