/*
 * Clozerr Impulse Gateway.
 * Acts as a publisher-subscriber based spearator between the Analytics Receiver view and the
 * Impulse sub-system.
 * */

var registry = global.registry;

var events = require("events")
var Q = require("q") 

var impulse_gateway = events.EventEmitter();

var emit = function( data ){
	var eventEmitter = new events.EventEmitter();
}

var listen = function( e ){
	var deferred = Q.defer();
	impulse_gateway.on( e,function( obj ){ deferred.resolve( obj ); } );
	return deferred;
}

registry.register("impulse", { emit:emit, listen:listen });
