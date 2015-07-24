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
		})
	});
	return deferred.promise;
}

var view_offers_checkin_create=function(params,user){
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		console.log("CC: Got vendor");
		registry.getSharedObject("data_offer").get(params).then(function(offer){
			console.log("CC: Got Offer");
			registry.getSharedObject("handler_predicate").get(user,vendor,offer).then(function(valid){
				console.log("CC: Valid");
				if(valid){
					console.log("creating checkin")
					debugger;
					registry.getSharedObject("handler_checkin").get(params, user,vendor,offer).then(function(checkin){
						console.log("got checkin")
						debugger;
						if(checkin){
							debugger;
							console.log("displaying")
							console.log( checkin );
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
var view_offers_dummy_checkin_create=function(params,user){
	var deferred = Q.defer();

	registry.getSharedObject("data_vendor").get(params).then(function(vendor){
		debugger;
		console.log(vendor.visitOfferId)
		registry.getSharedObject("data_offer").get({offer_id:vendor.visitOfferId}).then(function(offer){
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
							console.log("io emitting to signal , "+JSON.stringify({vendor_id:vendor._id,dummy:true}))
							global.io.emit('signal', JSON.stringify({vendor_id:vendor._id,dummy:true}) );
						} else {
							debugger;
							deferred.resolve({code:204,description:"cant create checkin"})
						}

					});
				}
				else {
					debugger;
					deferred.resolve({code:204,message:"invalid checkin"});
				}
			})
		})
	});

	return deferred.promise;
}

var view_vendor_offers_validate=function(params,user){
	var deferred = Q.defer();
	var vendor_account = user;
	registry.getSharedObject("models_Checkin").findOne({_id:params.checkin_id}).exec().then(function(checkin){
		if( !checkin ){
			deferred.reject( { result: false, message:"No such checkin"} );
			return;
		}
		registry.getSharedObject("data_vendor").get({vendor_id:checkin.vendor}).then(function(vendor){
			debugger;
			registry.getSharedObject("handler_validate").get(params,vendor,user,checkin).then(function(val_checkin){
				debugger;
				if(val_checkin){
					registry.getSharedObject('data_user').get({_id:checkin.user}).then(function(user){
						console.log(" gcm pushing to "+(checkin.gcm_id||user.gcm_id||0))
						registry.getSharedObject("gcm").sendPushNotification(checkin.gcm_id||user.gcm_id||0,
							registry.getSharedObject("display").GCMCheckinDisplay(checkin,vendor))
					})
					deferred.resolve(registry.getSharedObject("qualify").getCheckinOnValidateDisplay(checkin));
				}
				else
					deferred.resolve({result:false,message:"invalid checkin"});
			}, function(err) {
				deferred.reject(err);
			});
		}, function(err) {
			deferred.reject(err);
		});
	}, function(err) {
		deferred.reject(err);
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
			var obj = registry.getSharedObject("util").filterObject(params, ["caption", "description", "type"]);
			if(!obj.result) {
				deferred.resolve({result:false, err:obj.err});
			}
			else {

				var offer_new = new Offer(obj.data);
				if (params.vendor)
					offer_new.vendor=params.vendor
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
var view_offer_details_get = function(params,user){
	var deferred = Q.defer();
	var offer = registry.getSharedObject("data_offer");
	offer.get(params).then(function(offerObj){
		deferred.resolve(offerObj);
	})
  return deferred.promise;
}
var view_offer_details_set = function( params, user ) {
    var deferred = Q.defer();

    var offerObjectM = registry.getSharedObject("data_offer");
    var userObjectM = registry.getSharedObject("live_session");

    userObjectM.get( params ).then(function(user) {
        debugger;
        if(user.type == "Vendor") {
        	debugger;
               offerObjectM.get( params ).then(function(offer) {
               	  debugger;
                if(params.offer) {
                	debugger;
                    for(key in params.offer) {
                    	debugger;
                        offer[key] = params.offer[key];
                        offer.markModified(key);
                    }
                    debugger;
                    offer.save();
                    debugger;
                    deferred.resolve(offer);
                }
                else {
                    deferred.resolve({code:500,error:'invalid params'});
                }
            }, function(err) {
                deferred.resolve({code:500,error:err});
            });

    }
    else {
        deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
    }
}, function(err) {
    deferred.resolve({code:500,error:err});
});

return deferred.promise;

}
registry.register("view_offers_checkin_validate", {get:view_vendor_offers_validate});
registry.register("view_offers_checkin_create", {get:view_offers_checkin_create});
registry.register("view_vendor_checkin", {get:view_offers_dummy_checkin_create});
registry.register("view_offers_checkin_qrcodevalidate", {get:view_vendor_offers_qrcodevalidate});
registry.register("view_vendor_offers_qrcodevalidate", {get:view_vendor_offers_qrcodevalidate});

registry.register("view_offer_details_get",{get:view_offer_details_get});
registry.register("view_offer_details_set",{get:view_offer_details_set});
global.registry.register("view_vendor_offers_create", {get:view_vendor_offers_create});
