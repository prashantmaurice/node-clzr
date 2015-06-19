var registry=global.registry;
var Q=require('q');
var _=require('underscore');
var view_user_add_favourites=function(params,user){
	var deferred=Q.defer();
	console.log('On favourites add url');
  if(!user.favourites)
     user.favourites = [];    
	if(_.indexOf(user.favourites,params.vendor_id)==-1&&params.vendor_id)
		{
		user.favourites.push(params.vendor_id);
		user.markModified("favourites");
		user.save(function(err,user){
			deferred.resolve(user);
	   },
		function(err){
			deferred.reject(err);
		});
	}
	else
		deferred.resolve(user);

	return deferred.promise;
}
var view_user_add_pinned=function(params,user){
	var deferred=Q.defer();
	console.log('On favourites add url');

	if(!user.pinned)
		user.pinned=[];
	if(_.indexOf(user.pinned,params.offer_id)==-1&&params.offer_id)
	{	user.pinned.push(params.offer_id);
		user.markModified("pinned");
		user.save(function(err,user){
		deferred.resolve(user);
		},
		function(err){
			deferred.reject(err);
		})
	}
	else
		deferred.resolve(user);

	return deferred.promise;
}
global.registry.register("view_user_add_favourites",{get:view_user_add_favourites});
global.registry.register("view_user_add_pinned",{get:view_user_add_pinned});

module.exports={add_favourites:view_user_add_favourites};
