
var registry = global.registry;

var Q = require("q");
var _ = require("underscore");

var compute_analytics=function(map,reduce,query,scope){
	
	return registry.getSharedObject('models_Analytics').mapReduce({
		query:query,
		map:map,
		reduce:reduce,
		scope:scope,
		verbose:true
	}, function (err, data, stats) {
        
        if( err ) throw err;

		return Q( data );
	});


}

var analytics_mapreduce = function(params) {
	/*
	 * Params requires
	 * dimensions
	 * metric
	 * time_interval
	 * vendor_id
	 * query
	 */

	var deferred = Q.defer();

	var scope = {};

	scope.dimensions = (params.dimensions);
	//scope.metric = (params.metric);
    console.log( params );
	
    scope.time_interval = 24*60*60*1000; // 1 day.
	scope.extern = params.scope;

	if(params.time_interval) 
		scope.time_interval = params.time_interval*1;
		
	
	var map_byVendor = function() {

		var obj = {};

		var dims = {};

		var allow = true;
		

		var EXTERN = 0;
		for( var i = 0; i < dimensions.length; i++ ){
			var dim = dimensions[i];
			dims[dim] = this.dimensions[dim];
		}


		obj.dimensions = dims;
		obj.metric = this.metric;	
		obj.time = parseInt((this.timeStamp.getTime())/time_interval) * time_interval;
		
		EXTERN;

		if( allow )
			emit( obj, 1 );
	}
	var reduce = function(key, values) {
		return Array.sum(values);
	}

	var query = params.query;

	var mapper = map_byVendor;

	if( params.extern ){

		var mapS = "(" + String( mapper ) + ")";
	
        var externS = "(" + String( params.extern ) + ")";

        externS += "();";

        mapS = mapS.replace( "EXTERN;", externS );

		mapper = eval( mapS );

    }

	return compute_analytics(mapper, reduce, query, scope);
}

registry.register("analytics_mapreduce", {get: analytics_mapreduce} );
