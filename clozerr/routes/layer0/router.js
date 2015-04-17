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
    var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    debugger;

    if( !registry ){
        logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + handler + "_" + view );
    debugger;
        console.log(httpObjView);
    if( !httpObjView ){
        debugger;
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + handler + "_" + view ) )) );
        debugger;
        res.end();
    }

    else {
        debugger;
        try{
            httpObjView.get( req.query ).then( function( output ){
                res.send( JSON.stringify( output ) );
            }, function( err ){
                throw err;
            }).done();
        } catch( err ){
            var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
            res.send( error );
            res.end();
        }

    }
});

module.exports = router;
