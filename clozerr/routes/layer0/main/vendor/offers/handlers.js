var registry = global.registry;
var Q = require("q");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var vendor_checkin = function(params, user, vendor, offer) {
	debugger;
	return registry.getSharedObject("handler_checkin_" + offer.type).get(params, user, vendor, offer);
}

var vendor_predicate = function(user, vendor, offer) {
	debugger;
	if(vendor.offers.indexOf(offer._id) != -1) {
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
	if(user.type == "Vendor" && checkin.vendor == user.vendor_id && JSON.parse(JSON.stringify(vendor.offers)).indexOf(checkin.offer.toString()) != -1) {
		registry.getSharedObject("data_offer").get({offer_id:checkin.offer}).then(function(offer){
			return registry.getSharedObject("handler_validate_" + offer.type).get( vendor, user, checkin);
		})
	}
	else {
		return Q(false);
	}
}

var vendor_validate_qrcode = function(params, vendor, user, checkin) {
	debugger;
	if(params.qrcode) {
		checkin.validate_data ={qrcode:params.qrcode};
		checkin.validate_data.validatedBy = user._id;
		checkin.markModified("validate_data");
	if(vendor.qrcodes.indexOf(checkin.validate_data.qrcode) != -1) {
		debugger;
		return registry.getSharedObject("handler_validate_" + params.offer.type).get( vendor, user, checkin);
	}
	else {
		return Q(false);
	}
	}
	return Q(false);
}

global.registry.register("handler_checkin", {get:vendor_checkin});
global.registry.register("handler_validate", {get:vendor_validate});
global.registry.register("handler_predicate", {get:vendor_predicate});
global.registry.register("handler_validate_qrcode", {get:vendor_validate_qrcode});