
// register error handlers.

var registry = global.registry;

var view_error = function(){
    this.production = false;
    this.makeError = function( params ){
        if( this.production ){
            return { result:false, err:{ code: params.code, description: params.error.message } };
        }else{
            return { result:false, err:{ code: params.code }, full_error: params.error.stack };
        }
    }
}

registry.register("view_error", new view_error() );
