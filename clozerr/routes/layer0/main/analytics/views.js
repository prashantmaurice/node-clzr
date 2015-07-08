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
	analytics_obj.test=params.test||false;
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
			$gte:(new Date(params.start*1)).toISOString(),
			$lte:(new Date(params.end*1)).toISOString(),
		}
	}
	else
		query={}
	console.log(query)
	return compute_analytics(map_byDay,reduce,query,scope);
}

var view_analytics_vendor_get = function(params, user) {
	var deferred = Q.defer();

	var scope = {};
	scope.filterObject = global.registry.getSharedObject('util').filterObject;
	scope.filterDimension = function(dim_this, dim_filter) {
		if(dim_filter.length != 0) {
			return filterObject(dim_this, dim_filter,false).data;
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

	if(params.time_interval) {
		scope.time_interval = params.time_interval*1;
	}
	else {
		scope.time_interval = 24*60*60*1000;//1 day
	}

	debugger;

	if(user.type == "Vendor") {
		scope.vendor_id = user.vendor_id.toString();
		map_byVendor = function() {
			if(filterMetric(this.metric, metric)) {
				if(this.dimensions) {
					if(this.dimensions.vendor_id) {
						debugger;
						if(this.dimensions.vendor_id == vendor_id) {
							emit({
								metric:this.metric,
								dimensions:filterDimension(this.dimensions, dimensions),
								time:parseInt((this.timeStamp.getTime())/time_interval)
							}, 1);
						}
					}
				}
			}
		}
		reduce = function(key, values) {
			return Array.sum(values);
		}

		var query = {};

		debugger;

		if(params.time_start && params.time_end) {
			query = {timeStamp:{
				$gte:(new Date(params.time_start*1)).toISOString(),
				$lte:(new Date(params.time_end*1)).toISOString()
			}}
		}

		console.log(query);

		return compute_analytics(map_byVendor, reduce, query, scope);
	}
	else {
		deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
	}

	return deferred.promise;
}

registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})
global.registry.register('view_analytics_vendor_get', { get : view_analytics_vendor_get });
registry.register("view_analytics_byDay",{get:view_analytics_byDay})
