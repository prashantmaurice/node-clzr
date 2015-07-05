var registry = global.registry;
var data_rewards = function( params){
    return registry.getSharedObject("models_Offer").find(params).exec()
}
var create_rewards = function(params){
    return registry.getSharedObject('models_Offer').create(params).exec()
}
registry.register("data_rewards", {get:data_rewards,create:create_rewards});
