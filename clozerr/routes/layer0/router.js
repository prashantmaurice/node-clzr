/*
 * Layer incharge of handling the HTTP calls immediately behind
 * expressJS
 */

 var express = require("express");
 var init = require("./init");
 var router = express.Router();

 function makeRegLookupError( lookup ){
   return { description: lookup + ": shared object not found." , code: 500  }
}

router.get("/:object/:handler/:view", function( req, res ){
    var registry = global.registry;
    // var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    if( !registry ){
        // logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + handler + "_" + view );
    if( !httpObjView ){
        res.status(404)
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + handler + "_" + view ) )) );
        res.end();
    }

    else {
        try{
            httpObjView.get( req.query ,req.user).then( function( output ){
                debugger;
                if(!output){
                    res.status(500)
                    res.end('')
                    return;
                } 
                if(output.code)
                    res.status(output.code)
                if(output.err){
		    console.log("error: ");
                    console.log(output.err)
                    if(output.err.code)
                        res.status(output.err.code)
                    else
                        res.status(404)
                }
                res.send( JSON.stringify( output ) );
            }, function( err ){
		debugger;
                throw err;
            	/*console.log("caught error : ");
		console.log( err );
            	var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
            	res.send( error );
            	res.end();*/
            }).done();
        } catch( err ){
            console.log("caught error : "+err);
	    console.log( err );
            var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
            res.send( error );
            res.end();
        }

    }
});

router.get("/:object/:view", function( req, res ){
    var registry = global.registry;
    // var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    if( !registry ){
        // logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + view );
    if( !httpObjView ){
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + view ) )) );
        res.end();
    }

    else {
        try{
            httpObjView.get( req.query ,req.user).then( function( output ){
                if(output.code)
                    res.status(output.code)
                if(output.err){
                    console.log("error : "+output.err)
                    if(output.err.code)
                        res.status(output.err.code)
                    else
                        res.status(404)
                }
                debugger;
                res.send( JSON.stringify( output ) );
            }, function( err ){
                throw err;
            }).done();
        } catch( err ){
            console.log("caught error : "+err);
            var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
            res.send( error );
            res.end();
        }

    }
});
router.post("/:object/:handler/:view", function( req, res ){
    var registry = global.registry;
    // var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    if( !registry ){
        // logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + handler + "_" + view );
    debugger;
    if( !httpObjView ){
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + handler + "_" + view ) )) );
        res.end();
    }
    else {
        try{
            httpObjView.post( req.body ,req.user).then( function( output ){
                if(output.code)
                    res.status(output.code)
                if(output.err){
                    console.log("error : "+output.err)
                    if(output.err.code)
                        res.status(output.err.code)
                    else
                        res.status(404)
                }
                debugger;
                res.send( JSON.stringify( output ) );
            }, function( err ){
                throw err;
            }).done();
        } catch( err ){
            console.log("caught error : "+err);
            var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
            res.send( error );
            res.end();
        }

    }
});
router.post("/:object/:view", function( req, res ){
    var registry = global.registry;
    // var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    if( !registry ){
        // logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + view );
    debugger;
    if( !httpObjView ){
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + view ) )) );
        res.end();
    }
    else {
        try{
            httpObjView.post( req.body ,req.user).then( function( output ){
                if(output.code)
                    res.status(output.code)
                if(output.err){
                    console.log("error : "+output.err)
                    if(output.err.code)
                        res.status(output.err.code)
                    else
                        res.status(404)
                }
                debugger;
                res.send( JSON.stringify( output ) );
            }, function( err ){
                throw err;
            }).done();
        } catch( err ){
            console.log("caught error : "+err);
            var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
            res.send( error );
            res.end();
        }

    }
});
module.exports = router;
