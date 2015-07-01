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
var compute_analytics=function(map,reduce,query,scope){
	return Q(registry.getSharedObject('models_Analytics').mapReduce({
		query:query,
		map:map,
		reduce:reduce,
		scope:scope
	}))
}

function makeArray(obj) {
	if(obj.constructor != Array) {
		return [ obj ];
	}
	else {
		return obj;
	}
}

var view_analytics_all_byDay = function(params,user){

	var scope = {};
	scope.filterObject = global.registry.getSharedObject('util').filterObject;
	scope.dimensions = makeArray(params.dimensions);

	map_byDay=function(){
	    emit({
	        metric:this.metric,
	        dimensions:filterObject(this.dimensions, dimensions).data,
	        time:new Date(this.timeStamp.getFullYear(),
	            this.timeStamp.getMonth(),
	            this.timeStamp.getDate(),
	            0,0,0,0)
	    },1)
	}
	reduce=function(key,values){
	    return Array.sum(values)
	}
	return compute_analytics(map_byDay,reduce,{},scope);
}

registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})
registry.register("view_analytics_all_byDay",{get:view_analytics_all_byDay})