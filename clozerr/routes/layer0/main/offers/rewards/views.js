var registry=global.registry
var Q=require('q')

var view_offers_reward_create=function(params,user){
	params.type='reward'
	offer = registry.getSharedObject('view_vendor_offers_create').get(params,user)
	return offer
}
var give_reward=function(user,offer_id){
	//TODO can user have multiple rewards?
	console.log('giving reward '+offer_id+ ' to user '+user._id)
	if(!user.rewards)
		user.rewards=[]
	if(user.rewards.indexOf(offer_id)==-1){
		user.rewards.push(offer_id)
		user.markModified('rewards')
		return Q(user.save())
	} else {
		console.log('user ' +user._id+' already has reward '+offer_id)
		return Q(user)
	}
}
var view_offers_reward_give=function(params,user){
	var deferred=Q.defer();
	if(!params.user_id || !params.reward_id || !params.vendor_id){
		deferred.resolve({code:204,error:'invalid params'})
	}
	else if(params.vendor_id != user.vendor_id){
		deferred.resolve({code:400,error:'unauthorized request'})
	}
	else{ 
		registry.getSharedObject('data_user').get({_id:params.user_id}).then(function(users){
			var user_receiver=users[0]
			give_reward(user_receiver,params.reward_id).then(function(user){
				deferred.resolve(user)
			})
		})
	}
	return deferred.promise
}
var view_offers_reward_transfer=function(params,user){
	var deferred=Q.defer();
	if(user.id==0 || !params.user_receiver || !params.reward_id)
		deferred.resolve({code:204,error:'invalid params'})
	else{
		//secure more
		var idx=user.rewards.indexOf(params.reward_id)
		if(idx==-1){
			deferred.resolve({code:400,error:'user doesn\'t have this offer'})
		} else {
			console.log('removing reward '+user.rewards[idx]+' from user '+ user._id)
			user.rewards.splice(idx,1)
			user.markModified('rewards')
			user.save()
			registry.getSharedObject('data_user').get({_id:params.user_receiver}).then(function(users){
				if(users.length==0){
					deferred.resolve({code:400,error:'receiver doesnt exist'})
				} else {
					var user_receiver=users[0]
					give_reward(user_receiver,params.reward_id).then(function(user){
						deferred.resolve(user)
					})
				}
			})
		}
	}
	return deferred.promise
}
registry.register("view_offers_reward_create", {get:view_offers_reward_create});
registry.register("view_offers_reward_give", {get:view_offers_reward_give});
registry.register("view_offers_reward_transfer", {get:view_offers_reward_transfer});



