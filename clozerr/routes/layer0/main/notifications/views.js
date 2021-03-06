var Q = require("q");
var registry = global.registry;

var view_notifications_vendor_get = function( params){
    var deferred=Q.defer();
	var vendor_activated_list=registry.getSharedObject("handler_get_notifications");
    
    vendor_activated_list.get(params).then(function(vendorQualified){
    	debugger;
    	deferred.resolve(vendorQualified);
    },function(err){
    	deferred.resolve({code:500,error:err});
    })
    return deferred.promise;
}
registry.register("view_notifications_vendor_get",{get:view_notifications_vendor_get});
