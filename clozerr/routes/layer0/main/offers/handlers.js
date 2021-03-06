var registry = global.registry;
var Q = require("q");
var _ = require("underscore")
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var vendor_checkin = function(params, user, vendor, offer) {
	console.log("routing to "+"handler_checkin_" + offer.type)
	return registry.getSharedObject("handler_checkin_" + offer.type).get(params, user, vendor, offer);
}
var contains_id=function(arr,id){
	return _.some(arr,function(obj){
		return obj.equals(id)
	})
}
var vendor_predicate = function(user, vendor, offer) {
	var valid=false
	if(offer.type=='reward'){
		return registry.getSharedObject("handler_predicate_" + offer.type).get(user, vendor, offer);
	}
	if(contains_id(vendor.offers,offer._id) || vendor.visitOfferId.equals(offer._id)) {
		return registry.getSharedObject("handler_predicate_" + offer.type).get(user, vendor, offer);
	}
	else {
		return Q(false);
	}
}

var vendor_validate = function(params, vendor, user, checkin) {
	if(params.validate_data) {
		checkin.validate_data = params.validate_data;
		checkin.markModified("validate_data");
	}
	debugger;
	var deferred=Q.defer();
	if(user.type == "Vendor" && checkin.vendor == user.vendor_id) {
		registry.getSharedObject("data_offer").get({offer_id:checkin.offer}).then(function(offer){
			deferred.resolve(registry.getSharedObject("handler_validate_" + offer.type).get( vendor, user, checkin));
		})
		return deferred.promise
	}
	else {
		return Q(false);
	}
}

var vendor_validate_qrcode = function(params, vendor, user, checkin) {
	debugger;
	var deferred=Q.defer();
	if(params.qrcode) {
		checkin.validate_data ={qrcode:params.qrcode};
		checkin.validate_data.validatedBy = user._id;
		checkin.markModified("validate_data");
	if(vendor.qrcodes.indexOf(checkin.validate_data.qrcode) != -1) {
		registry.getSharedObject("data_offer").get({offer_id:checkin.offer}).then(function(offer){
			deferred.resolve(registry.getSharedObject("handler_validate_" + offer.type).get( vendor, user, checkin));
		})
		return deferred.promise
	}
	else {
		return Q(false);
	}
	} else {
		return Q(false);
	}

}

global.registry.register("handler_checkin", {get:vendor_checkin});
global.registry.register("handler_validate", {get:vendor_validate});
global.registry.register("handler_predicate", {get:vendor_predicate});
global.registry.register("handler_validate_qrcode", {get:vendor_validate_qrcode});
