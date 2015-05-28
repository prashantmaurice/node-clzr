var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var view_vendor_offers_allOffers=function(params,user){
	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		registry.getSharedObject("data_vendor_offer").get(params,vendor).then(function(vendor_offers){
			Q(_.map(vendor_offers.offers,function(offer){
				return registry.getSharedObject("qualify").getOfferDisplay(user,vendor,offer)
			}))
		})
	})
}