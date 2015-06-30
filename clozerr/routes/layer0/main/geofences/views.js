var Q = require('q');

var view_geofence_details_create = function(params, user) {
	var deferred = Q.defer();

	var Geofence = global.registry.getSharedObject('models_Geofence');

	var geofence = new Geofence();
	geofence.location = [];
	geofence.location[0] = params.latitude;
	geofence.location[1] = params.longitude;
	geofence.type = global.registry.getSharedObject("settings").geofenceTypes.indexOf(params.type.toUpperCase());
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