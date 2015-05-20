var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var util = require("../../../qualify");

var view_vendor_offers_offerPage_S0 = function(params, user) {
	var deferred = Q.defer();
	registry.getSharedObject("data_vendor_withOffers").get(params).then(function(vendorWithOffers) {
		var plist = [];
		var displayOffers = [];
		var predicate = registry.getSharedObject("handler_predicate_S0");
		_.each(vendor.offers, function(element, index, array) {
			var deferred1 = Q.defer();
			var pr = predicate.get(user, vendor, element).then(function(offer) {
				displayOffers.push(util.getOfferDisplay(user, vendor, offer));
			});
			plist.push(pr);
		});
		Q.all(plist).then(function() {
			deferred.resolve(displayOffers);
		, function(err) {
			deferred.reject(err);
		});
	}, function(err) {
		deferred.reject(err);
	})
}

var view_vendor_offers_checkin_S0 = function(params, user) {
	var deferred = Q.defer();
	registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
		var predicate = registry.getSharedObject("handler_predicate_S0");
		predicate.get(user, vendor, )
	}, function(err) {
		deferred.reject(err);
	})
}