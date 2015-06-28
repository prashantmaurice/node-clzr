var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var view_vendor_offers_offersPage=function(params,user){
	console.log("Vendor offersPage")
	var deferred = Q.defer();
	registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
		registry.getSharedObject("data_vendor_offer").get(params,vendor).then(function(vendor_offers){
			var plist = [];
			debugger;

			registry.getSharedObject("models_Checkin").find({user:user._id, vendor:vendor._id}).exec().then(function(checkinsMade) {
				debugger;
				for(var i=0;i<vendor_offers.length;i++) {
					debugger;
					var checkin_old = _.filter(checkinsMade, function(ch) {
						return (vendor_offers[i]._id.toString() == ch.offer.toString());
					});
					debugger;
					var pr = registry.getSharedObject("qualify").getOfferDisplay(user, vendor, vendor_offers[i], checkin_old.length);
					plist.push(pr);
				}

				Q.all(plist).then(function(offersList) {
					debugger;
					deferred.resolve(offersList);
				});
			});
			//deferred.resolve(vendor_offers)
			// var predicate = registry.getSharedObject("handler_predicate");
			// var plist=[]
			// _.each(vendor_offers.offers,function(element,index,array){
			// 	plist.push(predicate.get(user,vendor,element))
			// })
			// Q.all(plist).then(function(predlist){
			// 	deferred.resolve(
			// 		_.map(_.filter(vendor_offers.offers,
			// 			function(val,idx){return predlist[idx]})
			// 		,function(offer){
			// 			return registry.getSharedObject("qualify").getOfferDisplay(user,vendor,offer)
			// 		}))
			// })
})
});
return deferred.promise;
}

var view_vendor_offers_checkin=function(params,user){
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		debugger;
		registry.getSharedObject("data_offer").get(params).then(function(offer){
			debugger;
			registry.getSharedObject("handler_predicate").get(user,vendor,offer).then(function(valid){
				debugger;
				if(valid){
					console.log("creating checkin")
					debugger;
					registry.getSharedObject("handler_checkin").get(params, user,vendor,offer).then(function(checkin){
						console.log("got checkin")
						debugger;
						if(checkin){
							debugger;
							console.log("displaying")
							deferred.resolve(registry.getSharedObject("qualify").getCheckinOnCheckinDisplay(checkin));
							console.log("io emitting to signal , "+JSON.stringify({vendor_id:vendor._id}))
							global.io.emit('signal', JSON.stringify({vendor_id:vendor._id}) );
						} else {
							debugger;
							deferred.resolve({code:204,description:"cant create checkin"})
						}
						
					});
				}
				else {
					debugger;
					deferred.resolve({result:false,message:"invalid checkin"});
				}
			})
		})
	});

	return deferred.promise;
}

var view_vendor_offers_validate=function(params,user){
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		registry.getSharedObject("models_Checkin").findOne({_id:params.checkin_id}).exec().then(function(checkin){
			debugger;
			registry.getSharedObject("handler_validate").get(params,vendor,user,checkin).then(function(val_checkin){
				debugger;
				if(val_checkin){
					console.log(" gcm pushin to "+(params.gcm_id||user.gcm_id||0))
					registry.getSharedObject("gcm").sendPushNotification(params.gcm_id||user.gcm_id||0,
						registry.getSharedObject("display").GCMCheckinDisplay(checkin,vendor))
					deferred.resolve(registry.getSharedObject("qualify").getCheckinOnValidateDisplay(checkin));
				}
				else
					deferred.resolve({result:false,message:"invalid checkin"});
			}, function(err) {
				deferred.resolve(err);
			});
		}, function(err) {
			deferred.resolve(err);
		});
	}, function(err) {
		deferred.resolve(err);
	});

	return deferred.promise
}

var view_vendor_offers_qrcodevalidate = function(params, user) {
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor").get( params ).then(function(vendor) {
		registry.getSharedObject("models_Checkin").findOne({_id:params.checkin_id}).exec().then(function(checkin) {
			debugger;
			registry.getSharedObject("handler_validate_qrcode").get(params, vendor, user, checkin).then(function(val_checkin) {
				debugger;
				if(val_checkin) {
					console.log(" gcm pushin to "+(params.gcm_id||user.gcm_id||0))
					registry.getSharedObject("gcm").sendPushNotification(params.gcm_id||user.gcm_id||0,
						registry.getSharedObject("util").getCheckinSuccessMessage(checkin))
					deferred.resolve(registry.getSharedObject("qualify").getCheckinOnValidateDisplay(checkin));
				}
				else {
					deferred.resolve({result:false,message:"invalid checkin"});
				}
			}, function(err) {
				deferred.resolve(err);
			})
		}, function(err) {
			deferred.resolve(err);
		});
	}, function(err) {
		deferred.resolve(err);
	});

	return deferred.promise;
}

registry.register("view_vendor_offers_offersPage", {get:view_vendor_offers_offersPage});
var view_vendor_offers_create = function(params, user) {
	var deferred = Q.defer();

	var Vendor = registry.getSharedObject("models_Vendor");
	var Offer = registry.getSharedObject("models_Offer");

	if(user.type == "Vendor") {
		if(user.vendor_id.toString() == params.vendor_id) {
			var obj = registry.getSharedObject("util").filterObject(params, ["caption", "description", "stamps", "type"]);
			if(!obj.result) {
				deferred.resolve({result:false, err:obj.err});
			}
			else {
				var offer_new = new Offer(obj.data);
				if(params.params) {
					offer_new.params = params.params;
				}
				debugger;
				offer_new.save();
				deferred.resolve(offer_new)
			}
		}
		else {
			deferred.resolve({result:false, err:{code:909, message:"Permission denied."}});
		}
	}
	else {
		deferred.resolve({result:false, err:{code:909, message:"Permission denied."}});
	}

	return deferred.promise;
}
var view_offer_get_details = function(params,user){
	var deferred = Q.defer();
	var offer = registry.getSharedObject("data_offer");
	offer.get(params).then(function(offerObj){
		deferred.resolve(offerObj);
	})
  return deferred.promise;
}
registry.register("view_vendor_offers_validate", {get:view_vendor_offers_validate});
registry.register("view_vendor_offers_checkin", {get:view_vendor_offers_checkin});
registry.register("view_vendor_offers_qrcodevalidate", {get:view_vendor_offers_qrcodevalidate});
registry.register("view_offer_get_details",{get:view_offer_get_details});

global.registry.register("view_vendor_offers_create", {get:view_vendor_offers_create});