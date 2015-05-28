var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var view_vendor_offers_allOffers=function(params,user){
	var deferred = Q.defer()
	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		console.log(vendor)
		registry.getSharedObject("data_vendor_offer").get(params,vendor).then(function(offers){
			var plist=[]
			_.each(offers,function(offer,index,array){
				plist.push(Q(true))
				// plist.push(registry.getSharedObject("handler_predicate").get(user,vendor,offer))
			})
			Q.all(plist).then(function(predlist){
				deferred.resolve(_.map(
					_.filter(offers,function(val,idx){return predlist[idx]})
					,function(offer){
						return (registry.getSharedObject("qualify").getOfferDisplay(user,vendor,offer))
					})
				)
			})
		})
	});
	return deferred.promise
}


registry.register("view_vendor_offers_allOffers",{get:view_vendor_offers_allOffers})