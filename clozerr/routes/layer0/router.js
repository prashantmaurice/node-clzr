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


function sendError( res, err, code ){
	res.status( code );
	res.send( err );
	res.end();
}
router.get("/:object/:handler/:view", function( req, res ){
    var registry = global.registry;
    // var logger = registry.getSharedObject("logger");
    
    var dataClass = req.params.object;
    var handler = req.params.handler;
    var view = req.params.view;
//    console.log("HIT: " + dataClass + " " + handler + " " + view );
    if( !registry ){
        // logger.err();
    }

	var analytics = registry.getSharedObject("view_analytics_hit").get;

    var httpObjView = registry.getSharedObject( "view_" + dataClass + "_" + handler + "_" + view );
    if( !httpObjView ){
		sendError( res, JSON.stringify(registry.getSharedObject("view_error").makeError( makeRegLookupError( "http_" + dataClass + "_" + handler + "_" + view ) ) ), 404 )
		return;
    }
    try{
			
            httpObjView.get( req.query ,req.user ).then( function( output ){
                if(!output){
                    sendError( res, "", 500 );
					return;
                } 

				// All OK.
                res.status( 200 );
				res.send( JSON.stringify( output ) );
				res.end();
				
				if( req.user.type == 'User' || req.user.type == 'TestUser' ){
					//Record analytics.
					var params = req.query;
					params.error = false;
					analytics( { metric: "url_" + dataClass + "_" + handler + "_" + view, dimensions: params }, req.user ).then( function(analytics){ console.log( analytics ) } );
				}

            } ).catch( function( err ){

				console.log("caught error : "+err);
				console.log( err );

				if( err.stack ){
					console.log(" Stack trace: ");
					console.log( err.stack );
				}

				var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
				
				sendError( res, error, 500 );
				if( req.user.type == 'User' || req.user.type == 'TestUser' ){
					//Record analytics.
					var params = req.query;
					params.error = true;
					analytics( { metric: "url_" + dataClass + "_" + handler + "_" + view, dimensions: params }, req.user ).then( function(analytics){ console.log( analytics ) } );
				}
			});

    } catch( err ){
            console.log("caught error : "+err);
			console.log( err );
			
			if( err.stack ){
				console.log( "Stack Trace: ");
				console.log( err.stack );
			}

			var error = registry.getSharedObject("view_error").makeError({ error:err, code:500 });
			sendError( res, error, 500 );
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
				if( !output ){
					res.end();
					return;
				}

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
            httpObjView.post( req.body, req.user ).then( function( output ){
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
