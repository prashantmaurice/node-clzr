var registry=global.registry
var Q = require('q')
var view_analytics_hit=function(params,user){
	var Analytics = registry.getSharedObject('models_Analytics')
	var analytics_obj=new Analytics();
	console.log(params)
	analytics_obj.timeStamp=params.time || Date.now();
	analytics_obj.user=user.id;
	analytics_obj.metric=params.metric;
	analytics_obj.dimensions=params.dimensions;
	return Q(analytics_obj.save())
}
registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})