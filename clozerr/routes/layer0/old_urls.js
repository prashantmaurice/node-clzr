/*
Mapping for old urls to ease transition to new ones
*/
var map_url=function(url,existing){
	var registry=global.registry
	registry.register(url,
		registry.getSharedObject(existing))
}
map_url('view_vendor_categories_get','view_category_list')
map_url('view_vendor_offers_checkin','view_offers_checkin_create')