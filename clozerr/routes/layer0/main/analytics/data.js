var registry=global.registry
var data_analytics=function(params){
	return registry.getSharedObject("models_Analytics").find(params).exec()
}
registry.register("data_analytics",{
	get:data_analytics
})