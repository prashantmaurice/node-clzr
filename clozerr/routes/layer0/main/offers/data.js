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
	if(!params.offer_id) 
        throw {code:500,error:'Invalid params'};

	return Q(registry.getSharedObject("models_Offer").findOne({
        _id:params.offer_id
    }).exec());
}

var request=require('request')
var analytics_checkin=function(params,checkin,user){
	return registry.getSharedObject('view_analytics_hit').get({
		time:Date.now(),
		metric:'checkin',
		dimensions:{
			'vendor':checkin.vendor,
			'offer':checkin.offer
		}
	},user)
}

registry.register("data_vendor_offer",{get:data_vendor_offer})
registry.register("data_offer",{get:data_offer})
