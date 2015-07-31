var registry=global.registry
var Q = require('q')
var view_analytics_hit=function(params,user){
	var Analytics = registry.getSharedObject('models_Analytics')
	var analytics_obj = new Analytics();

	console.log(params)
	analytics_obj.timeStamp = params.time || Date.now();
	analytics_obj.user = user.id;
	analytics_obj.metric = params.metric;
	analytics_obj.dimensions = params.dimensions;
	analytics_obj.test = params.test||false;
	
	return Q(analytics_obj.save()).then(function( analytics_obj ){
		// broadcast ID to all listeners prompting them to load the analytics data.
		global.io.emit('analytics', JSON.stringify({event_id:analytics_obj._id}) );
		return analytics_obj;
	});
}
var compute_analytics=function(map,reduce,query,scope){
	debugger;
	var deferred = Q.defer();
	registry.getSharedObject('models_Analytics').mapReduce({
		query:query,
		map:map,
		reduce:reduce,
		scope:scope,
		verbose:true
	}, function (err, data, stats) {
		debugger; 
    		//console.log('map reduce took %d ms', stats.processtime)
    		if(err) console.log(err);
    		else console.log(data);
		deferred.resolve( data );
	});

//	process.nextTick( function(){ deferred.resolve({"hello":"world"}) } );

	return deferred.promise;
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

var view_analytics_get = function( params, user ){

	// Check if user is admin.
	return Q( registry.getSharedObject("models_Analytics").find( params ) ).then( function( hits ){
		var analytics_admin_view = registry.getSharedObject("analytics_admin_view");
		return _.map( hits, function( hit ){ if( analytics_admin_view[hit.metric] ) return analytics_admin_view[hit.metric]( hit ); else return Q(false) } );
	} );
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
	//scope.metric = params.metric;
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
	
	query.metric = params.metric;
	console.log(query)
	return compute_analytics(map_byDay,reduce,query,scope);
}

var view_analytics_vendor_get = function(params, user) {
	var deferred = Q.defer();

	var scope = {};

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
		
		
		var map_byVendor = function() {

			var obj = {};

			
			var dims = {};
			for( var i = 0; i < dimensions.length; i++ ){
				var dim = dimensions[i];
				dims[dim] = this.dimensions[dim];
			}
			obj.dimensions = dims;
			obj.metric = this.metric;	
			obj.time = parseInt((this.timeStamp.getTime())/time_interval);
			//if( this.dimensions && this.dimensions.vendor_id && this.dimensions.vendor_id == vendor_id )
			emit( obj, 1 );
		}
		var reduce = function(key, values) {
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

		query.metric = params.metric;
		console.log(query);

		return compute_analytics(map_byVendor, reduce, query, scope);
	}
	else {
		process.nextTick(function(){
			deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
		});
		return deferred.promise;
	}
}
var view_analytics_vendor = function(params, user) {
    var scope = {
        metrics: [params.metric],
        dimensions: params.dimensions,
        getDimensions: function(thisD, reqD) {
            d = {}
            for (var dim in reqD) {
                var key = reqD[dim]
                if (thisD[key])
                    d[key] = thisD[key]
            }
            return d
        },
        vendor_id:user.vendor_id
    }
    var map_byVendor = function() {
        if ((this.dimensions.vendor_id)&&
        	(metrics.indexOf(this.metric) != -1)&&
        	(this.dimensions.vendor_id==vendor_id)) {
            emit({
                metric: this.metric,
                dimensions: getDimensions(this.dimensions, dimensions),
                time: new Date(this.timeStamp.getFullYear(),
                    this.timeStamp.getMonth(),
                    this.timeStamp.getDate(),
                    0, 0, 0, 0)
            }, 1)
        }
    }
    var reduce = function(key, values) {
        return Array.sum(values)
    }
    return compute_analytics()
}

registry.register("view_analytics_get", {get:view_analytics_get});
registry.register("view_analytics_hit",{get:view_analytics_hit,post:view_analytics_hit})
registry.register('view_analytics_vendor_get', { get : view_analytics_vendor_get });
registry.register("view_analytics_byDay",{get:view_analytics_byDay})
