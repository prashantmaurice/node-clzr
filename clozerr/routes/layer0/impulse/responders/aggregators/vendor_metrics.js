var registry = global.registry;
var impulse = global.impulse;

var ensure_metrics = function( vendor ){
	
	if( !vendor.computed )
		vendor.computed = {};

	if( !vendor.computed.metrics )
		vendor.computed.metrics = { 
			screen_views : {},
		};

}

var vendor_metric_count_views = function(){
	impulse.on("Vendor Screen", function( analytics_obj ){
		var vendorM = registry.getSharedObject("models_Vendor");

		Q( vendorM.findOne({_id:analytics_obj.dimensions.vendor_id}) ).then( function( vendor ){
			// make sure vendor object has the computed.metrics key.
			ensure_metrics( vendor );
			vendor.computed.metrics.screen_views[new Date().getDay()] += 1;

			vendor.markModified("computed");
			return vendor.save();

		}).then( function( vendor ){

			impulse.log("vendor screen views incremented");
		
		});

	});
}


