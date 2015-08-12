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
	// TODO: change id_type..
	if( user.id_type == "Anonymous" )
		throw { code:403, description:"Not Authenticated" };

	var context = {};
	return registry.getSharedObject("data_vendor").get(params).then(function(vendor){

		context.vendor = vendor;
		console.log("CC: Got vendor");
		return registry.getSharedObject("data_offer").get(params)

	}).then(function(offer){

		context.offer = offer;
		console.log("CC: Got Offer");
		return registry.getSharedObject("handler_predicate").get( user, context.vendor, context.offer );

	}).then(function(valid){

		console.log("CC: Valid");
		if( !valid ){
			throw { code:433, description:"Checkin is invalid" }
		}
		console.log("creating checkin")
			
		return registry.getSharedObject("handler_checkin").get( params, user, context.vendor, context.offer );

	}).then(function(checkin){

		console.log("got checkin")

		if( !checkin ){
			throw { code: 434, description:"Checkin does not exist" }
		}

		console.log("displaying")
		console.log( checkin );
		
		console.log("io emitting to signal , "+JSON.stringify({ vendor_id: context.vendor._id }));
		global.io.emit('signal', JSON.stringify({vendor_id:context.vendor._id}) );
		
		return registry.getSharedObject("qualify").getCheckinOnCheckinDisplay(checkin);// Ridiculous name.
	});
	
	//return deferred.promise;
}
/*
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
}*/

var view_vendor_offers_validate=function(params,user){
	var vendor_account = user;

	var context = { user:user, params:params };

	return Q(registry.getSharedObject("models_Checkin").findOne({_id:params.checkin_id}).exec()).then(function(checkin){

		if( !checkin ){
			throw { result: false, message:"No such checkin"} ;
		}
		context.checkin = checkin;
		return registry.getSharedObject("data_vendor").get({vendor_id:checkin.vendor})

	}).then(function(vendor){

		context.vendor = vendor;		
		return registry.getSharedObject("handler_validate").get( params, context.vendor, user, context.checkin );

	}).then(function(val_checkin){

		if( !val_checkin )
			throw { err: 435, message:"Error validating checkin."};
		
		return registry.getSharedObject('data_user').get({_id:context.checkin.user})

	}).then(function(user){

		//console.log(" gcm pushing to "+(checkin.gcm_id||user.gcm_id||0))

		registry.getSharedObject("gcm").sendPushNotification( 
			context.checkin.gcm_id || user.gcm_id || 0,
			registry.getSharedObject("display").GCMCheckinDisplay( context.checkin, context.vendor )
		);
		
		return registry.getSharedObject("qualify").getCheckinOnValidateDisplay( context.checkin );

	});

}

var view_vendor_offers_qrcodevalidate = function(params, user) {
	var deferred = Q.defer();
	// Ensure qrcode in the query.
	
	var context = {};
	return registry.getSharedObject("models_Checkin").findOne({_id:params.checkin_id}).then( function( checkin ){
		
		context.checkin = checkin;

		if( !checkin )
			throw { code:121, description:"No such checkin recorded." };
		
		if( !params.qrcode ){
			throw { code:121, description:"No QR code in query." };
		}


		return registry.getSharedObject("data_vendor").get( { vendor_id:checkin.vendor } );
		
	}).then(function( vendor ) {
		context.vendor = vendor;
		// Simple QR code check.. move this to a submodule and let it be handled abstractly.
		if( vendor.qrcodes.indexOf( params.qrcode ) == -1 )
			throw { code:122, description:"QR code does not belong to vendor."};
	
		params.validate_data = { stamps:1, method:"qrcode" };
		return registry.getSharedObject("handler_validate").get(params, context.vendor, user, context.checkin);
	}).then(function(val_checkin) {
		
		if( !val_checkin )
			throw {code:123, description:"Invalid request."};

		//console.log(" gcm pushin to "+(context.checkin.gcm_id||user.gcm_id||0));

		registry.getSharedObject("gcm").sendPushNotification( 
			context.checkin.gcm_id||user.gcm_id||0,
			registry.getSharedObject("display").GCMCheckinDisplay( context.checkin, context.vendor )
		);
		
		return registry.getSharedObject("qualify").getCheckinOnValidateDisplay( context.checkin );
	});
	
}

//registry.register("view_vendor_offers_offersPage", {get:view_vendor_offers_offersPage});

var view_vendor_offers_create = function(params, user) {
	
	var deferred = Q.defer();

	var Vendor = registry.getSharedObject("models_Vendor");
	var Offer = registry.getSharedObject("models_Offer");

	
	if(user.type != "Vendor") {
		throw { err: 438, description:"User is not a vendor." };
	}
	if(user.vendor_id.toString() != params.vendor_id) {
		throw { err: 439, description:"Vendor ID doesn't match."};
	}

	var obj = registry.getSharedObject("util").filterObject(params, ["caption", "description", "type"]);
	if(!obj.result) {
		throw {result:false, err:obj.err};
	}
		

	var offer_new = new Offer(obj.data);
	if (params.vendor)
		offer_new.vendor=params.vendor
		
	if(params.params)
		offer_new.params = params.params;
				
	return offer_new.save();
	
}
var view_offer_details_get = function(params,user){
	//var deferred = Q.defer();
	var offer = registry.getSharedObject("data_offer");
	return Q(offer.get(params));
  	//return deferred.promise;
}
var view_offer_details_set = function( params, user ) {

    var offerObjectM = registry.getSharedObject("data_offer");
    var userObjectM = registry.getSharedObject("live_session");// LIVE SESSION??

    if(user.type != "Vendor") {
		throw { err: 436, description: "User not authorized"};
    }

    return offerObjectM.get( params ).then(function(offer) {
        if( !params.offer ) {
			throw { err: 437, description: "Offer details not specified"};
        }

		for( key in params.offer ) {
                offer[key] = params.offer[key];
                offer.markModified(key);
        }
        
		return offer.save();

    });

}

registry.register("view_offers_checkin_validate", {get:view_vendor_offers_validate});
registry.register("view_offers_checkin_create", {get:view_offers_checkin_create});
//registry.register("view_vendor_checkin", {get:view_offers_dummy_checkin_create});
registry.register("view_offers_checkin_qrcodevalidate", {get:view_vendor_offers_qrcodevalidate});
registry.register("view_vendor_offers_qrcodevalidate", {get:view_vendor_offers_qrcodevalidate});

registry.register("view_offer_details_get",{get:view_offer_details_get});
registry.register("view_offer_details_set",{get:view_offer_details_set});
global.registry.register("view_vendor_offers_create", {get:view_vendor_offers_create});
