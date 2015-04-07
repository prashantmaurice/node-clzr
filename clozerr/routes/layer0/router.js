/*
 * Layer incharge of handling the HTTP calls immediately behind
 * expressJS
 */

var express = require("express");

var router = new express.Router();

router.get("/:object/:handler/:view", function( req, res ){
    var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;

    var registry = globals.registry;
    if( !registry ){
        logger.err();   
    }

    var httpObjView = registry.getSharedObject( "http_" dataClass + "_" + handler + "_" + view );
    if( !httpObjView ){
        res.send( JSON.stringify(registry.getSharedObject("error_regLookup").makeError("http_" dataClass + "_" + handler + "_" + view )) );
    }

    var obj = httpObjView.get( req.params );
    
    res.send( JSON.stringify( obj ) );
});
