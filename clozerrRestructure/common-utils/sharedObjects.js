'use strict';


/**
 *  This is a helper function used to attach objects on a global Object
 */


var registry = {};
var forwards = {};
function Registry() {}

Registry.prototype.register = function( key, object ){
    this.registry[key] = object;
    console.log("REGISTERED : " + key + " -> " + object);
};
Registry.prototype.register = function( key ){
    console.log(key);
    if( !key ) {
        console.log("Unregistered Key : " + key);
        return null;
    }

    console.log('GOT : ' + key);

    if( this.registry[key] )
        return this.registry[key];
    else{
        console.log("Forwarding");
        return this.getSharedObject( this.forwards[key] );
    }
};
Registry.prototype.forwardObject = function( src, dest ){
    this.forwards[src] = dest;
};




module.exports = new Registry();
