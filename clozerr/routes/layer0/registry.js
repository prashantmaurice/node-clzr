
/*
 * Implements a Shared Object registry for complete
 * separation of responsibilities
 * It is put into the globals variable so that any piece of code can
 * at any time access any module through the registry
 */
var Registry = function(){
    this.registry = {};

    this.register = function( key, object ){
        this.registry[key] = object;
    }

    this.getSharedObject = function( key ){
        return this.registry[key];
    }

}

globals.registry = new Registry();

/*
 * A publisher subscriber framework for further 
 * separation of responsibilities.
 * 
 * subscribe( key, callback ) - subscribes on a key.
 * publish( key, message ) - publishes a message on a key. 
 */

var MessageControl = function(){
    this.registry = {};

    this.subscribe = function( key, callback ){
        this.ensure( key );
        this.registry[key].push(callback);
    }
    this.publish = function( key, message ){

        this.ensure( key );
        
        var callbacks = this.registry[key];
        for( int i = 0; i < callbacks.length; i++ ){
            callbacks[i]( key, message );
        }

    }
    
    this.ensure = function( key ){
        if( !this.registry[key] )
            this.registry[key] = [];
    }

}

globals.messaging = new MessageConrol();
