var registry=global.registry
var data_analytics=function(params){
	return registry.getSharedObject("models_Analytics").find(params).exec()
}
var create_analytics=function(params){
	return registry.getSharedObject("models_Analytics").create(params)
}
registry.register("data_analytics",{
	get:data_analytics,
	create:create_analytics
})