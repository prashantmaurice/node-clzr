var registry=global.registry;
var Q=require('q');
var _=require('underscore');
var util =registry.getSharedObject('util');
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
var view_user_remove_favourites=function(params,user){
	var deferred=Q.defer();
	console.log('On favourites remove url');
  	if(!user.favourites)
    	user.favourites = [];   
	if(params.vendor_id) {
		idx=_.indexOf(user.favourites,params.vendor_id)
		if(idx!=-1){
			user.favourites.splice(idx,idx);
			user.markModified("favourites");
			user.save(function(err){
				deferred.reject(err)
			})
		}
		deferred.resolve(user);
	}
	else
		deferred.reject({description:'No vendorid'});

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
var view_user_remove_pinned=function(params,user){
	var deferred=Q.defer();
	console.log('On pinned remove url');
  	if(!user.pinned)
    	user.pinned = [];   
	if(params.offer_id) {
		idx=_.indexOf(user.pinned,params.offer_id)
		if(idx!=-1){
			user.pinned.splice(idx,idx);
			user.markModified("pinned");
			user.save(function(err){
				deferred.reject(err)
			})
		}
		deferred.resolve(user);
	}
	else
		deferred.reject({description:'No offer_id'});

	return deferred.promise;
}

var view_user_favourites_list = function(params,user){
	var deferred=  Q.defer();
	var vendor = registry.getSharedObject("data_vendor");
	var vendorPlist = [];
	_.each(user.favourites,function(vendorid){
	       	vendorPlist.push(vendor.get({vendor_id:vendorid}).then(function(favvendor){
         return {name:favvendor.name,
         	image:favvendor.image,
         	location:favvendor.location,
          id:favvendor._id};
    }))
	})
	Q.all(vendorPlist).then(function(vendorList){
		debugger;
		deferred.resolve(vendorList);
	})
	return deferred.promise;
}
var view_user_pinned_list = function(params,user){
	var deferred=  Q.defer();
	deferred.resolve(user.pinned);
	return deferred.promise;
}

global.registry.register("view_user_add_favourites",{get:view_user_add_favourites});
global.registry.register("view_user_add_pinned",{get:view_user_add_pinned});
global.registry.register("view_user_remove_favourites",{get:view_user_remove_favourites});
global.registry.register("view_user_remove_pinned",{get:view_user_remove_pinned});
global.registry.register("view_user_favourites_list",{get:view_user_favourites_list});
global.registry.register("view_user_pinned_list",{get:view_user_pinned_list});
module.exports={add_favourites:view_user_add_favourites};
