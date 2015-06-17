var registry=global.registry;
var Q=require('q');

var view_user_add_favourites=function(params,user){
	var deferred=Q.defer();
	console.log('On favourites add url')
var vendorObjectM=registry.getSharedObject("data_vendor");
var userObjectM=registry.getSharedObject("live_session");
var vendorObj=null;
if(!user.favourites)
{
	user.favourites={};
	user.favourites.vendor=[];
	user.favourites.offer=[];
}
if(params.vendor_id)
{
		user.favourites.vendor.push(params.vendor_id);
		user.markModified("favourites");
		user.save(function(err,user){
			deferred.resolve(user);
	   },
		function(err){
			deferred.reject(err);
		});
}
else if(params.offer_id){
		user.favourites.offer.push(params.offer_id);
		user.markModified("favourites");
		user.save(function(err,user){
		deferred.resolve(user);
		},
		function(err){
			deferred.reject(err);
		})	
	}
	return deferred.promise;
}
global.registry.register("view_user_add_favourites",{get:view_user_add_favourites});

module.exports={add_favourites:view_user_add_favourites};
