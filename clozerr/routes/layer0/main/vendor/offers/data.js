var registry = global.registry;
var Q = require("q");

var data_vendor_offer=function(params,vendor){
	var deferred=Q.defer();
	registry.getSharedObject("models_Offer").find({
		_id: {
			$in: vendor.offers 
		}
	}).then(function(offers){
		console.log(offers)
		deferred.resolve(offers)
	})
	return deferred.promise
}

registry.register("data_vendor_offer",{get:data_vendor_offer})