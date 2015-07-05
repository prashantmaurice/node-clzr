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
	if(obj == undefined) {
		return [];
	}
	else if(obj.constructor != Array) {
		return [ obj ];
	}
	else {
		return obj;
	}
}

var view_analytics_byDay = function(params,user){
	var scope = {};
	scope.filterObject = global.registry.getSharedObject('util').filterObject;
	scope.filterDimension = function(dim_this, dim_filter) {
		if(dim_filter.length != 0) {
			return filterObject(dim_this, dim_filter).data;
		}
		else {
			return dim_this;
		}
	}
	scope.filterMetric = function(metric_this, metric_filter) {
		if(metric_filter.length != 0) {
			if(metric_filter.indexOf(metric_this) != -1) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return true;
		}
	}
	scope.dimensions = makeArray(params.dimensions);
	scope.metric = makeArray(params.metric);
	var map_byDay=function(){
		if(filterMetric(this.metric, metric)) {
			emit({
				metric:this.metric,
				dimensions:filterDimension(this.dimensions, dimensions),
				time:new Date(this.timeStamp.getFullYear(),
					this.timeStamp.getMonth(),
					this.timeStamp.getDate(),
					0,0,0,0)
			},1)
		}
	}
	var reduce=function(key,values){
		return Array.sum(values)
	}
	if(params.start && params.end)
		query={timeStamp:{
		    $gte:(new Date(params.start)).toISOString(),
		    $lte:(new Date(params.end)).toISOString(),
		    }}
	else
		query={}
	console.log(query)
	return compute_analytics(map_byDay,reduce,query,scope);
}

registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})
registry.register("view_analytics_byDay",{get:view_analytics_byDay})
