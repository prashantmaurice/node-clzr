var Q = require('q');

var view_geofence_details_create = function(params, user) {
	var deferred = Q.defer();

	var Geofence = global.registry.getSharedObject('models_Geofence');
	var geofenceTypes = global.registry.getSharedObject("settings").geofenceTypes;

	var geofence = new Geofence({ location : [params.latitude, params.longitude] });

	debugger;
	if(params.type.constructor != Array) {
		params.type = [params.type];
	}
	debugger;
	var type_flg = geofenceTypes[params.type[0].toUpperCase()];
	for(var i=1; i<params.type.length; i++) {
		type_flg = type_flg | geofenceTypes[params.type[i].toUpperCase()];
	}
	debugger;
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

	global.registry.getSharedObject('data_geofences_near').get(params).then(function(geofences) {
		deferred.resolve(geofences);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

global.registry.register('view_geofence_list_near', { get : view_geofence_list_near });