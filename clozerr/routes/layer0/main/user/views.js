var registry=global.registry;
var Q=require('q');
var _=require('underscore');
var util =registry.getSharedObject('util');
var view_user_favourites_add=function(params,user){
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
			deferred.resolve({code:500,error:err});
		});
	}
	else
		deferred.resolve(user);

	return deferred.promise;
}
var view_user_favourites_remove=function(params,user){
	var deferred=Q.defer();
	console.log('On favourites remove url');
	if(!user.favourites)
		user.favourites = [];   
	if(params.vendor_id) {
		idx=_.indexOf(user.favourites,params.vendor_id)
		if(idx!=-1){
			user.favourites.splice(idx,1);
			user.markModified("favourites");
			user.save(function(err){
				deferred.resolve({code:500,error:err});
			})
		}
		deferred.resolve(user);
	}
	else
		deferred.resolve({code:204,error:'No vendorid'});

	return deferred.promise;
}
var view_user_pinned_add=function(params,user){
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
			deferred.resolve({code:500,error:err});
		})
	}
	else
		deferred.resolve(user);

	return deferred.promise;
}
var view_user_pinned_remove=function(params,user){
	var deferred=Q.defer();
	console.log('On pinned remove url');
  	if(!user.pinned)
    	user.pinned = [];   
	if(params.offer_id) {
		idx=_.indexOf(user.pinned,params.offer_id)
		if(idx!=-1){
			user.pinned.splice(idx,1);
			user.markModified("pinned");
			user.save(function(err,user){
				deferred.resolve(user);
			},
			function(err){
				deferred.resolve({code:500,error:err});
			})
		}
		else
			deferred.resolve(user);
	} else {
		deferred.resolve({code:400,error:"invalid params (no offerid)"});
	}
	return deferred.promise;
}

var view_user_favourites_list = function(params,user){
	var deferred=  Q.defer();
	var vendor = registry.getSharedObject("data_vendor");
	var vendorPlist = [];
	_.each(user.favourites,function(vendorid){
	       	vendorPlist.push(vendor.get({vendor_id:vendorid}).then(function(favvendor){
         return favvendor;
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
var view_user_details_get = function(params,user){
	var deferred = Q.defer();
	if(!user.rewards)
		user.rewards=[]
	user.save();
	registry.getSharedObject('data_rewards')
	.get({_id:{$in:user.rewards}}).then(function(rewards){
		// console.log(rewards)
		var nuser=user.toObject()
		nuser.rewards=rewards;
		// console.log(nuser)
		deferred.resolve(nuser)
	})
	return deferred.promise;
}


global.registry.register("view_user_favourites_add",{get:view_user_favourites_add});
global.registry.register("view_user_pinned_add",{get:view_user_pinned_add});
global.registry.register("view_user_favourites_remove",{get:view_user_favourites_remove});
global.registry.register("view_user_pinned_remove",{get:view_user_pinned_remove});
global.registry.register("view_user_favourites_list",{get:view_user_favourites_list});
global.registry.register("view_user_pinned_list",{get:view_user_pinned_list});
global.registry.register("view_user_details_get",{get:view_user_details_get});
module.exports={add_favourites:view_user_favourites_add};
