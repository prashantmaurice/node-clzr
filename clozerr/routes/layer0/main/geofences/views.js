var Q = require('q');
var _ = require('underscore');

var view_geofence_details_create = function(params, user) {
	var deferred = Q.defer();

	var Geofence = global.registry.getSharedObject('models_Geofence');
	var geofenceTypes = global.registry.getSharedObject("settings").geofenceTypes;

	var geofence_params = {};
	if(params.params) {
		geofence_params = params.params;
	}

	var geofence = new Geofence({ location : [params.latitude, params.longitude] , params : geofence_params });

	if(params.type.constructor != Array) {
		params.type = [params.type];
	}

	var type_flg = geofenceTypes[params.type[0].toUpperCase()];
	for(var i=1; i<params.type.length; i++) {
		type_flg = type_flg | geofenceTypes[params.type[i].toUpperCase()];
	}

	geofence.type = type_flg;
	geofence.radius = params.radius;

	geofence.save(function(err) {
		deferred.reject(err);
	});

	deferred.resolve(geofence);

	return deferred.promise;
}

global.registry.register('view_geofence_details_create', { get : view_geofence_details_create } );

var view_geofence_list_near = function(params, user) {
	var deferred = Q.defer();

	var Geofence = global.registry.getSharedObject('models_Geofence');
	var mec_util = require('../../util/min_enclosing_circle');
	var geofenceTypes = global.registry.getSharedObject("settings").geofenceTypes;

	global.registry.getSharedObject('data_geofences_near').get(params).then(function(geofences) {
		debugger;
		var points = _.map(geofences, function(geofence) {
			return { x : geofence.location[0], y : geofence.location[1] };
		});
		var obj = mec_util.minEnclosingCircle(points);

		var geofence = new Geofence({ location : [obj.x, obj.y], radius : obj.r });
		geofence.type = geofenceTypes["ONEXIT"] | geofenceTypes["RELOAD"];
		geofence.params = {};
		geofence.params.url = "http://api.clozerr.com/v2/geofence/list/near";

		geofence.save();
		geofences.push(geofence);

		deferred.resolve(geofences);

	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

global.registry.register('view_geofence_list_near', { get : view_geofence_list_near });