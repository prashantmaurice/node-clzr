var Q = require('q');

var load_geofence = function(params) {
	var deferred = Q.defer();

	var Geofence = global.registry.getSharedObject("models_Geofence");
	Geofence.findOne({ _id : params.geofence_id }).exec().then(function(geofence) {
		deferred.resolve(geofence);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

global.registry.register('data_load_geofence', { get : load_geofence });

var load_geofences_near = function(params) {
	var deferred = Q.defer();

	var Geofence = global.registry.getSharedObject("models_Geofence");
	params.limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    params.offset=params.offset || 0;
	Geofence.find({
		location : {
			$near : [params.latitude, params.longitude]
		}
	}).limit(params.limit).skip(params.offset).exec().then(function(geofences) {
		deferred.resolve(geofences);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

global.registry.register('data_geofences_near', { get : load_geofences_near });