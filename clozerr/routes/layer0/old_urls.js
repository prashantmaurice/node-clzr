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
map_url('view_user_add_pinned','view_user_pinned_add')
map_url('view_user_add_favourites','view_user_favourites_add')
map_url('view_user_remove_pinned','view_user_pinned_remove')
map_url('view_user_remove_favourites','view_user_favourites_remove')
map_url('view_vendor_get_details','view_vendor_details_get')
map_url('view_vendor_offers_offerspage','view_vendor_offerspage')