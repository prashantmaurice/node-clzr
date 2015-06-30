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
var compute_analytics=function(map,reduce,query){
	return Q(registry.getSharedObject('models_Analytics').mapReduce({
		query:query,
		map:map,
		reduce:reduce
	}))
}
var view_analytics_all_byDay = function(params,user){
	map_byDay=function(){
	    emit({
	        metric:this.metric,
	        dimensions:this.dimensions,
	        time:new Date(this.timeStamp.getFullYear(),
	            this.timeStamp.getMonth(),
	            this.timeStamp.getDate(),
	            0,0,0,0)
	    },1)
	}
	reduce=function(key,values){
	    return Array.sum(values)
	}
	return compute_analytics(map_byDay,reduce,{})
}
registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})
registry.register("view_analytics_all_byDay",{get:view_analytics_all_byDay})