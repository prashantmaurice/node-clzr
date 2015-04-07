
var Q = require("Q");
var registry = globals.registry;

var handle_freebie_checkin = function( params, user, vendor ){
    // Make a freebie checkin.   
}

var handle_freebie_validate = function( params, checkin ){
    // Validate the given checkin.
    // Use a data module to load the checkin object. or use the default http_checkin for this.
}

var handle_freebie_list = function( params, vendor, user ){
    // Return a list of freebies that can be used by this user at this vendor.
}
