var registry=global.registry
var Q=require('q')

var view_offer_reward_create=function(params,user){
	params.type='reward'
	offer = view_vendor_offer_create(params,user)
	// add reward to user list
	return offer
}