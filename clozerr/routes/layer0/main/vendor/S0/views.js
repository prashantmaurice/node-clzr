var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var view_vendor_offers_offers_S0=function(params,user){
	var deferred = Q.defer();
	registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
		registry.getSharedObject("data_vendor_S0").get(params,vendor).then(function(vendor_offers){
			var predicate = registry.getSharedObject("handler_predicate_S0");
			var plist=[]
			_.each(vendor_offers.offers,function(element,index,array){
				plist.push(predicate.get(user,vendor,element))
			})
			Q.all(plist).then(function(predlist){
				deferred.resolve(
					_.map(_.filter(vendor_offers.offers,
						function(val,idx){return predlist[idx]})
					,function(offer){
						return registry.getSharedObject("qualify").getOfferDisplay(user,vendor,offer)
					}))
			})
		})
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

var view_vendor_offers_limitedtimeoffers = function(params, user) {
	var deferred = Q.defer();

	var offerList = [];

	params.vendors = user.favourites.vendors;

	registry.getSharedObject("data_vendors_withLimitedTimeOffers").get(params).then(function(allOffers) {

		for(key in allOffers) {
			for(offer in allOffers[key].offers) {
				var obj = {};

				//TODO : modify this obj for required view

				obj.vendor = allOffers[key].vendor;
				obj.offer = offer;
				offerList.push(obj);
			}
		}

		deferred.resolve(offerList);

	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

registry.register("view_vendor_offers_checkin_S0", {get:view_vendor_offers_checkin_S0});
registry.register("view_vendor_offers_validate_S0", {get:view_vendor_offers_validate_S0});
registry.register("view_vendor_offers_offers_S0", {get:view_vendor_offers_offers_S0});
registry.register("view_vendor_offers_limitedtimeoffers", {get:view_vendor_offers_limitedtimeoffers});