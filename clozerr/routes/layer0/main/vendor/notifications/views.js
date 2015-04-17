var Q = require("q");
var registry = global.registry;

var view_vendor_get_notifications = function( params){
    var deferred=Q.defer();
	var vendor_activated_list=registry.getSharedObject("handler_get_notifications");
    
    vendor_activated_list.get(params).then(function(vendorQualified){
    	debugger;
    	deferred.resolve(vendorQualified);
    },function(err){
    	deferred.reject(err);
    })
    return deferred.promise;
}
registry.register("view_vendor_get_notifications",{get:view_vendor_get_notifications});
