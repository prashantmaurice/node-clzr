var registry=global.registry
var Q=require('q')
var _=require('underscore')
var jwt = require('jsonwebtoken')
var utils = require("../../../util.js")

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
		user.rewards={ current:[], gifting:[] };
	if(user.rewards.current.indexOf(offer_id)==-1){
		user.rewards.current.push(offer_id)
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

var view_offers_rewards_redeem = function( params, user ){
    
    utils.require_args( params, ['token', 'access_token'] );
    

    if( user.type == "Anonymous" )
        throw { code:541, description:"Not authenticated." }
  
	
    // Verfiy signature of certificate.
    var token = jwt.verify( params.token, registry.getSharedObject("settings").gift_certificate.secret );
    
	if( user.rewards.current.indexOf( token.reward ) != -1 )
		throw { cose: 542, description:"User already has reward" };
	
	console.log( token );
    // If it's expired then reject.
    if( new Date( token.expiry ) <= new Date() )
        throw { code: 542, description:"Gift Expired" };

    // Push into the user's current giftbox.
    user.rewards.current.push( token.reward );
	user.markModified("rewards");

	return Q( user.save().then( function(){
		return Q( { result: true } );
	}) );

}
var view_offers_rewards_make_transfer_token = function( params, user ){
    
    utils.require_args( params, ['reward_id','access_token']);

    if( user.type == "Anonymous" )
        throw { code:241, description:"Not authenticated." }

    if( user.rewards.current.indexOf( params.reward_id ) == -1 )
        throw { code:242, description:"No such reward in user's current gift-box" }

    var expiry = registry.getSharedObject("settings").gift_certificate.expiry;

    // Remove reward from the rewards.current object.
    user.rewards.current.splice( user.rewards.current.indexOf( params.reward_id ) );

    // Add it to gifting object.
    user.rewards.gifting.push( params.reward_id );
	
	user.markModified("rewards");
	console.log(user.rewards); 

    // Sign a JWT certificate for the reward.
    var token = jwt.sign({ reward: params.reward_id, expiry: new Date().getTime() + expiry, user: user._id }, registry.getSharedObject("settings").gift_certificate.secret );
    return Q( user.save().then( function( user ){
		return Q( { token: token } );
	} ) );
}

var view_offers_rewards_user=function(params,user){
	
    var context = {};
    
    if( !user.rewards || ( user.rewards.length != undefined ) )
        user.rewards = { current:[], gifting:[] };

	console.log( user.rewards );
    return Q( registry.getSharedObject('data_rewards')
    .get({_id:{$in:user.rewards.current}}) ).then(function(rewards){

		return Q( _.map( rewards, registry.getSharedObject('display').rewardListDisplay ) );

    }).then( function( rewards ){
        
        context.rewards = _.map( rewards, function(reward){ reward.params.active=true; return reward; } );
        return registry.getSharedObject('data_rewards').get({_id:{$in:user.rewards.gifting}});

    }).then( function( rewards ){
        
        return Q( _.map( rewards, registry.getSharedObject('display').rewardListDisplay ) )
    
    }).then( function( rewards ){

        return context.rewards.concat( _.map( rewards, function( reward ){ reward.params.active=false; return reward; } ) );
    
    });
}

registry.register("view_offers_reward_create", {get:view_offers_reward_create});
registry.register("view_offers_reward_give", {get:view_offers_reward_give});
registry.register("view_offers_reward_transfer", {get:view_offers_reward_transfer});
registry.register("view_offers_rewards_user", {get:view_offers_rewards_user});
registry.register("view_offers_rewards_redeem", {get:view_offers_rewards_redeem});
registry.register("view_offers_rewards_make_transfer_token", {get:view_offers_rewards_make_transfer_token});
