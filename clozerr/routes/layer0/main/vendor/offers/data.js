var registry = global.registry;
var Q = require("q");

var data_vendor_offer=function(params,vendor){
	var deferred=Q.defer();
	return registry.getSharedObject("models_Offer").find({
		_id: {
			$in: vendor.offers 
		}
	}).exec()
}

var data_offer=function(params){
	var deferred=Q.defer();
	if(!params.offer_id) deferred.reject();
	return registry.getSharedObject("models_Offer").findOne({
		_id:params.offer_id
	}).exec()
}

registry.register("data_vendor_offer",{get:data_vendor_offer})
registry.register("data_offer",{get:data_offer})