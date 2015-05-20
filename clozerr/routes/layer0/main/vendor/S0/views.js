var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var qualify = registry.getSharedObject("qualify");

var view_vendor_offers_offerPage_S0 = function(params, user) {
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor_withOffers").get(params).then(function(vendorWithOffers) {
		var plist = [];
		var displayOffers = [];
		var predicate = registry.getSharedObject("handler_predicate_S0");
		_.each(vendor.offers, function(element, index, array) {
			var deferred1 = Q.defer();
			var pr = predicate.get(user, vendor, element).then(function(offer) {
				displayOffers.push(qualify.getOfferDisplay(user, vendor, offer));
			});
			plist.push(pr);
		});
		Q.all(plist).then(function() {
			deferred.resolve(displayOffers);
		}
		, function(err) {
			deferred.reject(err);
		});
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

var view_vendor_offers_checkin_S0 = function(params, user) {
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor_withOffers").get(params).then(function(vendor) {
		var offer_id = params.offer_id;
		var offer = _.find(vendor.offers, function(offer) {
			return (offer._id == offer_id);
		});
		if(offer == null) {
			//TODO : throw error : request made with an offer id which is not an offer given by that particular vendor
		}
		registry.getSharedObject("handler_predicate_S0").get(user, vendor, offer).then(function(offer) {
			if(offer) {
				registry.getSharedObject("vendor_checkin_S0").get(params, user, vendor, offer).then(function(checkin) {
					deferred.resolve(qualify.getCheckinOnCheckinDisplay(checkin));
				}, function(err) {
					deferred.reject(err);
				});
			}
			else {
				//TODO : throw error here -- object empty here.. not an offer for the user
			}
		}, function(err) {
			deferred.reject(err);
		}); 
		
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

var view_vendor_offers_validate_S0 = function(params, user) {
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
		registry.getSharedObject("data_checkin").get(params, user).then(function(checkin_obj) {
			registry.getSharedObject("vendor_validate_S0").get(params,vendor,user,checkin).then(function(checkin) {
				deferred.resolve(qualify.getCheckinOnValidateDisplay(checkin));
			}, function(err) {
				deferred.reject(err);
			});
		}, function(err) {
			deferred.reject(err);
		});
	});

	return deferred.promise;
}