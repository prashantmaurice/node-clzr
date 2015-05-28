var registry = global.registry;
var Q = require("q");

var vendor_checkin = function(params, user, vendor, offer) {
	return registry.getSharedObject("handler_checkin" + offer.type).get(params, user, vendor, offer);
}

var vendor_predicate = function(user, vendor, offer) {
	return registry.getSharedObject("handler_predicate" + offer.type).get(user, vendor, offer);
}

var vendor_validate = function(params, vendor, user, checkin) {
	return registry.getSharedObject("handler_validate" + params.offer.type).get(params, vendor, user, checkin);
}

global.registry.register("handler_checkin", {get:vendor_checkin});
global.registry.register("handler_validate", {get:vendor_validate});
global.registry.register("handler_predicate", {get:vendor_predicate});