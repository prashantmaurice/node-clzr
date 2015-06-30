var registry = global.registry;
var data_rewards = function( params, vendor ){
    return registry.getSharedObject("models_Offer").find({
        _id:{
            $in: vendor.offers,
        },
        type:"reward"
    }).exec()
}
var create_rewards = function(params){
    return registry.getSharedObject('models_Offer').create(params).exec()
}
registry.register("data_rewards", {get:data_rewards,create:create_rewards});
