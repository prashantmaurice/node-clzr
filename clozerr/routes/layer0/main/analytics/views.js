var registry=global.registry
var Q = require('q')
var view_analytics_hit=function(params,user){
	create_params={
		timeStamp:params.time || Date.now(),
		user:user.id,
		metric:params.metric,
		dimensions:params.dimensions
	}
}
registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})