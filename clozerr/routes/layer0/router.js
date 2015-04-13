/*
 * Layer incharge of handling the HTTP calls immediately behind
 * expressJS
 */

var express = require("express");
var init = require("./init");
var router = new express.Router();

function makeRegLookupError( lookup ){
 return { description: lookup + ": shared object not found." , code: 500  }
}

router.get("/:object/:handler/:view", function( req, res ){
    var registry = global.registry;
    var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    if( !registry ){
        logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + handler + "_" + view );
    console.log(httpObjView);
    if( !httpObjView ){
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + handler + "_" + view ) )) );
    }
    
    httpObjView.get( req.params ).then( function( output ){
        res.send( JSON.stringify( obj ) );
    }, function( err ){
        var errorBuilder = registry.getSharedObject("view_error").makeError({ description:err, code:500 });
        res.send();
    });
    

});

module.exports = router;