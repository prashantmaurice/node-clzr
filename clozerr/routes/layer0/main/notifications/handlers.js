var Q=require("q");
var registry=global.registry;



var handler_get_notifications = function(params){
	var deferred=Q.defer();
	var userObjectM=registry.getSharedObject("live_session");
	var vendorListM=registry.getSharedObject("data_nearbyvendors_list");
	vendorListM.get(params).then(function(vendorlist){
		debugger;
		var vendorQualified=[];
		for(var i=0;i<vendorlist.length;i++){
             if(vendorlist[i].settings){
             	if(vendorlist[i].settings.neighbourhoodperks){
          if(vendorlist[i].settings.neighbourhoodperks.activated)
          {	vendorQualified.push(vendorlist[i]);debugger;}}}
		}
		deferred.resolve(vendorQualified);
	},function(err){
		deferred.resolve({code:500,error:err});
	});
	return deferred.promise;
}
registry.register("handler_get_notifications",{get:handler_get_notifications});