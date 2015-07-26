var registry=global.registry
var Q=require('q')
var _=require('underscore')

var view_offers_reward_create=function(params,user){
	params.type='S0'
	
   
	if(!params.vendor_id)
	    throw {code:500,error:'reward needs vendor_id'};
    
	return registry.getSharedObject('data_vendor').get({vendor_id:params.vendor_id}).then(function(vendor){
		params.vendor={
			_id:vendor.id,
			name:vendor.name
		}
		return registry.getSharedObject('view_vendor_offers_create').get(params,user)
        
    }).then( function( offer ){
		if( params.image )
			offer.image = params.image;
		return offer.save();
	});
}
var give_reward = function(user,offer_id){
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
var view_offers_reward_give = function(params,user){
	var deferred=Q.defer();
	if(!params.user_id || !params.reward_id || !params.vendor_id){
		throw {code:204,error:'invalid params'};
	}
	if(params.vendor_id != user.vendor_id){
		throw {code:400,error:'unauthorized request'};
	}
	
	return registry.getSharedObject('data_user').get({_id:params.user_id}).then(function(users){
		var user_receiver = users[0];
		return give_reward(user_receiver,params.reward_id);
	});
}

var view_offers_reward_transfer=function(params,user){
	var deferred=Q.defer();
	if( user.id==0 || !params.user_receiver || !params.reward_id )
		throw {code:204,error:'invalid params'};
	
		//secure more
	var idx=user.rewards.indexOf(params.reward_id)
	if(idx==-1)
		throw {code:400,error:'user doesn\'t have this offer'};

	console.log('removing reward '+user.rewards[idx]+' from user '+ user._id)
	user.rewards.splice(idx,1)
	user.markModified('rewards')
			
    return registry.getSharedObject('data_user').get({_id:params.user_receiver}).then(function(users){
		if(users.length==0)
			throw {code:400,error:'receiver doesnt exist'};
				
	    user.save()
		var user_receiver=users[0];
		
        return give_reward(user_receiver,params.reward_id);
    });
}

var view_offers_rewards_user=function(params,user){
	
    return registry.getSharedObject('data_rewards')
	.get({_id:{$in:user.rewards}}).then(function(rewards){

		return Q( _.map(rewards,registry.getSharedObject('display').rewardListDisplay) );
	
    });
}

registry.register("view_offers_reward_create", {get:view_offers_reward_create});
registry.register("view_offers_reward_give", {get:view_offers_reward_give});
registry.register("view_offers_reward_transfer", {get:view_offers_reward_transfer});
registry.register("view_offers_rewards_user", {get:view_offers_rewards_user});
