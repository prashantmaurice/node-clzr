var Q = require("q");
var registry = global.registry;

var data_tag = function( params ){
    return registry.getSharedObject("models_Tag").find(params).exec();
}
registry.register("data_tag",{get:data_tag})