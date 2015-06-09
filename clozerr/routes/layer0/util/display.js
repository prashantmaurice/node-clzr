var registry = global.registry;

function vendorSearchDisplay(vendor){
	return {
		id:vendor.id,
		name:vendor.name,
		location:vendor.location
	}
}

registry.register("display",{
	"vendorSearchDisplay":vendorSearchDisplay
})