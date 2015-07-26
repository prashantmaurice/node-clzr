var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var view_vendor_offers_offerPage_S1 = function( params, user ){

 	console.log('in view_vendor_offers_offerPage_S1');
 	
	var vendorObjectData = registry.getSharedObject("data_vendor_S1");
 	var deferred = Q.defer();
	debugger;
 	var plist=[];
 	var context = { params:params, user:user };
 	
	return registry.getSharedObject("data_vendor").get(params).then(function( vendorObj ){
   		
		context.vendor = JSON.parse(JSON.stringify(vendorObj));
   		return vendorObjectData.get(params, vendorObj)

	}).then(function(vendor) {
    
		return registry.getSharedObject("qualify").assignFlagsToOffer(userObj, vendor)

	}).then(function(offers) {
      	
		plist = [];
      	var offersview = [];

        
        return Q.all( 
		    _.map( offers, function( offer ){ 
			    return  registry.getSharedObject("qualify").getOfferDisplay( context.user, context.vendor, offers ); 
		    })
		);

	}).then(function( offers ) {
          	//console.log('q.all');
          	console.log( offers );
          	vendor.offers = offers;
          	deferred.resolve(vendor);
        });
      
}

registry.register('view_vendor_offers_offersPage_S1', {get:view_vendor_offers_offerPage_S1});

var view_vendor_homepage_S1 = function( params, vendor, user ){
    /*
     * Calculate the required offer and place it in vendor.offer
     * Use any means necessary. use special properties in the vendor if necessary
     * This method abstracts the technique from the requirement.
     * We could get all the vendors offers here and sort them by stamplist.
     * Or we might store the stamplist pre-ordered by stamps here and only fetch that offer. 
     */

   }
