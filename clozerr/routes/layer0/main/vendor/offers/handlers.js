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
	return registry.getSharedObject("handler_validate_" + params.offer.type).get(params, vendor, user, checkin);
}

global.registry.register("handler_checkin", {get:vendor_checkin});
global.registry.register("handler_validate", {get:vendor_validate});
global.registry.register("handler_predicate", {get:vendor_predicate});