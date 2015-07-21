var registry = global.registry;

function vendorDisplay(vendor){
	return {
		_id:vendor.id,
		name:vendor.name,
		location:vendor.location,
		image:vendor.image
	}
}
function GCMCheckinDisplay(checkin,vendor){
	return { 
		type: "STANDARD",
		title: "Check-in Successful", 
		message: "Your visit at " + vendor.name + " has been confirmed!" 
	}
}
function rewardListDisplay(reward){
	// return {
	// 	_id:reward._id,
	// 	type:reward.type||"reward",
	// 	caption:reward.caption,
	// 	description:reward.description,
	// 	params:reward.params||{type:'sample'},
	// 	image:reward.image||"",
	// 	vendor_id:reward.vendor_id
	// }
	return reward
}
var offerDisplay = function (offer){
	return {
		_id:offer._id,
		type:offer.type,
		caption:offer.caption,
		description:offer.description,
		params:offer.params,
		image:offer.image||"",
		stamps:offer.params.stamps
	}
}
registry.register("display",{
	"vendorDisplay":vendorDisplay,
	"GCMCheckinDisplay":GCMCheckinDisplay,
	"rewardListDisplay":rewardListDisplay,
	"offerDisplay":offerDisplay
})
