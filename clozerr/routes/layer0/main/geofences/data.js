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
var create_geofence=function(params){
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

	return Q(geofence.save())
}
global.registry.register('data_geofences_near', { get : load_geofences_near });

global.registry.register('data_geofences', { get : load_geofence , create : create_geofence});
