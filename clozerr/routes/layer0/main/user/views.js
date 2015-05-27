var registry=global.registry;
var Q=require('q');

var view_user_add_favourites=function(params){
	console.log('On favourites add url')
var vendorObjectM=registry.getSharedObject("data_vendor");
var userObjectM=registry..getSharedObject("util_session");
var vendorObj=null;
if(params.vendor_id)
vendorObjectM.get(params).then(function(vendor){
 vendorObj=vendor;
})

}
