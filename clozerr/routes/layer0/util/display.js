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

registry.register("display",{
	"vendorDisplay":vendorDisplay,
	"GCMCheckinDisplay":GCMCheckinDisplay
})
