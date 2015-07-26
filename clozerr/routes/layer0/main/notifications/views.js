var Q = require("q");
var registry = global.registry;
var _ = require("underscore");


// NOT A REST ENDPOINT.
// STATEFUL NATURE
// CREATED FOR EASE OF USE
var view_notifications_list_all = function( params, user ){
    var notificationM = registry.getSharedObject("models_Notification");

    console.log("In notification.");
    console.log( params );
    console.log( user );
    debugger;
    
    if( !user.notifications ){
        user.notifications = {};
    }

    if( !user.notifications.list ){
        user.notifications.list = [];
    }
    

    var preamble = {};
    if( params.since )
        preamble = { timestamp:{ $gte:params.since } };
   
    notificationM.find({type:"all"}).exec().then( function( res ){ debugger; }, function(err){ debugger; } );

    return Q.all( [ notificationM.find( _.extend( { type:"all" }, preamble ) ).exec(), 
            notificationM.find( _.extend( { _id:{$in:user.notifications.list} }, preamble ) ).exec() ] )
        .then(function( notifs ){
            debugger;
            console.log( notifs );
            var notifs = notifs[0].concat(notifs[1]);
            console.log(notifs); 
            return Q(notifs);

        });

}

var view_notifications_list_since = function( params, user ){
	if( user.notifications && user.notifications.last_seen )
		params.since = user.notifications.last_seen
	return view_notifications_list_all( params, user ).then( function( notifs ){
		return view_notifications_read_all( params, user ).then( function( status ){
			if( status )
				return Q(notifs);	
			else
				return({code:564, description:"Error setting last seen"});
		});
	});
}
var view_notifications_read_all = function( params, user ){

    if( !user.notifications ){
        user.notifications = {};
    }

    if( !user.notifications.list ){
        user.notifications.list = [];
    }
    
    user.notifications.last_seen = new Date();
    user.markModified("notifications");
    user.save( function( res ){ console.log( res ); }, function( err ){ console.log( err ); } );

    return Q({result:true});
}

//registry.register("view_notifications_vendor_get",{get:view_notifications_vendor_get});
registry.register("view_notifications_list_all",{get:view_notifications_list_all});
registry.register("view_notifications_read_all",{get:view_notifications_read_all});
