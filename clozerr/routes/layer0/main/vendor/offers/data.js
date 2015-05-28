var registry = global.registry;
var Q = require("q");

var data_vendor_offer=function(params,vendor){
	var Offer = registry.getSharedObject("models_Offer");
	Offer.find({
		_id: {
			$in: vendor.offers 
		}
	}).then(function(offers){
		vendor.offers=offers
		return Q(offers)
	})
}

registry.register("data_vendor_offer",{get:data_vendor_offer})