var registry=global.registry
var Q=require('q')

var view_offers_reward_create=function(params,user){
	params.type='reward'
	offer = registry.getSharedObject('view_vendor_offers_create').get(params,user)
	return offer
}
var view_offers_reward_give=function(params,user){
	var deferred=Q.defer();
	if(!params.user_id || !params.offer_id || !params.vendor_id)
		deferred.resolve({code:204,error:'invalid params'})
	if(params.vendor_id != user.vendor_id)
		deferred.resolve({code:400,error:'unauthorized request'})
	registry.getSharedObject('data_user').get(params).then(function(user){
		if(!user.rewards)
			user.rewards=[]
		user.rewards.push(params.offer_id)
		deferred.resolve(user)
	})
	return deferred.promise
}
registry.register("view_offers_reward_create", {get:view_offers_reward_create});
registry.register("view_offers_reward_give", {get:view_offers_reward_give});