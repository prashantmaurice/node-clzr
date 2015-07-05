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
	return {
		_id:reward._id,
		type:reward.type||"reward",
		caption:reward.caption,
		description:reward.description,
		params:reward.params||{type:'sample'},
		image:reward.image||""
	}
}
registry.register("display",{
	"vendorDisplay":vendorDisplay,
	"GCMCheckinDisplay":GCMCheckinDisplay,
	"rewardListDisplay":rewardListDisplay
})
