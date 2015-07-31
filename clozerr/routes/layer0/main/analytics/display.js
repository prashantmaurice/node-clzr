
var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var analytics_admin_view = {
    "Clozerr_Home_Screen" : function( obj ){
       return { caption:"Home page hit.", description:"Home page hit.", raw:obj };
    },
    "default": function( obj ){
        return { caption:"Display failed.", description:"Analytics display for metric '" + obj.metric + "' is missing. Add a display in analytics/display.js to handle this metric.", raw:obj };
    }
}

registry.register("analytics_admin_view", analytics_admin_view);
