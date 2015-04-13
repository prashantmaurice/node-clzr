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

    if( !registry ){
        logger.err();   
    }

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + handler + "_" + view );
    console.log(httpObjView);
    if( !httpObjView ){
        res.send( JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + handler + "_" + view ) )) );
        res.end();
    }
   
    try{
        httpObjView.get( req.query ).then( function( output ){
            res.send( JSON.stringify( obj ) );
        }, function( err ){
            throw err;
        }).done();
    } catch( err ){
        var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
        res.send( error );
        res.end();
    }
    

});

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> 28ff33b79ad373c66ed7f0844e2a028bde2e4684
