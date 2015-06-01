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
				debugger;
				//removing the dummy visit offer from all other offers..

				if(offer._id.toString() != vendor.visitOfferId.toString()) {
					plist.push(registry.getSharedObject("qualify").getOfferDisplay(user,vendor,offer));
				}
			});
			Q.all(plist).then(function(offerList){
				deferred.resolve(offerList);
			});
		});
	});
	
	return deferred.promise;
}

var view_vendor_offers_checkin=function(params,user){
	var deferred = Q.defer()
	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		debugger;
		registry.getSharedObject("data_offer").get(params,vendor).then(function(offer){
			debugger;
			registry.getSharedObject("handler_predicate").get(user,vendor,offer).then(function(valid){
				debugger;
				if(valid){
					debugger;
					registry.getSharedObject("handler_checkin").get(user,vendor,offer).then(function(checkin){
						deferred.resolve(registry.getSharedObject("qualify").getCheckinOnCheckinDisplay(checkin))
					})
				}
				else {
					debugger;
					deferred.resolve("{result:false,message:invalid checkin}")
				}
			})
		})
	})
	return deferred.promise
}

var view_vendor_offers_validate=function(params,user){
	var deferred = Q.defer()
	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		registry.getSharedObject("data_checkin").get({_id:params.checkin_id}).then(function(checkin){
			registry.getSharedObject("handler_validate").get(params,vendor,user,checkin).then(function(val_checkin){
				if(val_checkin)
					deferred.resolve(registry.getSharedObject("qualify").getCheckinOnValidateDisplay(checkin))
				else
					deferred.resolve("{result:false,message:invalid checkin}")
			})
		})
	})
	return deferred.promise
}

registry.register("view_vendor_offers_alloffers", {get:view_vendor_offers_allOffers});
registry.register("view_vendor_offers_validate", {get:view_vendor_offers_validate});
registry.register("view_vendor_offers_checkin", {get:view_vendor_offers_checkin});