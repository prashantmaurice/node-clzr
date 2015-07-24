var Q = require('q');
var _ = require('underscore');

var view_geofence_details_create = function(params, user) {
	var deferred = Q.defer();
	registry.getSharedObject('data_geofences').create(params).then(function(geofence){
		deferred.resolve(geofence);	
	})	
	return deferred.promise;
}

global.registry.register('view_geofence_details_create', { get : view_geofence_details_create } );


var view_geofence_list_near = function(params, user) {
	var deferred = Q.defer();
	
	if( !params.latitude || !params.longitude )
		return Q({code:400, description:"No Location"});

	var Geofence = global.registry.getSharedObject('models_Geofence');
	var mec_util = require('../../util/min_enclosing_circle');
	var geofenceTypes = global.registry.getSharedObject("settings").geofenceTypes;
	
	
	global.registry.getSharedObject('data_geofences_near').get(params).then(function(geofences) {
		debugger;
		var points = _.map(geofences, function(geofence) {
			return { x : geofence.location[0], y : geofence.location[1] };
		});

		var obj = mec_util.minEnclosingCircle(points);
		console.log( obj );
		var geofence = new Geofence({ location : [obj.x, obj.y], radius : obj.r });
		geofence.type = geofenceTypes["ONEXIT"] | geofenceTypes["RELOAD"];
		geofence.params = {};
		geofence.params.url = "http://api.clozerr.com/v2/geofence/list/near";

		//geofence.save();
		geofences.push(geofence);

		deferred.resolve(geofences);

	}, function(err) {
		deferred.reject(err);
	})

	return deferred.promise;
}

global.registry.register('view_geofence_list_near', { get : view_geofence_list_near });
