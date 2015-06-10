var registry = global.registry;

function vendorDisplay(vendor){
	return {
		_id:vendor.id,
		name:vendor.name,
		location:vendor.location,
		image:vendor.image
	}
}


registry.register("display",{
	"vendorDisplay":vendorDisplay
})