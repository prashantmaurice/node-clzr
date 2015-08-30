var Q = require('q');
var _ = require('underscore');


var geofence_for_vendor= function( vendor, type, radius, params ) {
	var loc = vendor.location;
	
	var geofenceM = registry.getSharedObject("models_Geofence");
	var fence = new geofenceM({ location: loc, type: type, radius: radius, params: params, vendors:[] });
	
	//if( !fence.vendors )
	//	fence.vendors = [];
		
	fence.vendors.push( vendor._id );
	var context = {};
	
	return fence.save().then( function( fence ){
		if( !vendor.geofences )
			vendor.geofences = [];
		
		context.fence = fence;	
		vendor.geofences.push( fence._id );
		return vendor.save();
	}).then( function( vendor ){
		return fence;
	});
}	

global.registry.register('geofence_for_vendor', { create : geofence_for_vendor });
