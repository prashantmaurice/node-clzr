/*
 * Clozerr Impulse Gateway.
 * Acts as a publisher-subscriber based spearator between the Analytics Receiver view and the
 * Impulse sub-system.
 * */

var registry = global.registry;

var events = require("events")
var Q = require("q") 

var impulse_gateway = new events.EventEmitter();

var emit = function( key, event, user ){
	impulse_gateway.emit( key, {event:event, user:user} );
}

var listen = function( e, fun ){
	impulse_gateway.on( e,function( obj ){ fun( obj.event, obj.user ); } );
}

registry.register("impulse", { emit:emit, listen:listen });
global.impulse = {emit:emit, listen:listen};
