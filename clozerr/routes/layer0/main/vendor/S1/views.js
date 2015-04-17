var registry = global.registry;

var view_vendor_offers_offerPage_S1 = function( params, vendor, user ){
    var vendorObjectData = registry.getSharedObject("http_vendor_S1");
    vendorObjectData.get( params, vendor ).then( function( vendor ){
    
    /*
     * Implement S1 type vendor's my offers page return.
     */
     Offer.find({$in : {_id : vendor.offers}}, function (err, offers) {
        console.log(offers);
     });     

    }, function( user ){
    
    } );
}

registry.register('view_vendor_offers_offerPage_S1', {get:view_vendor_offers_offerPage_S1});

var view_vendor_homepage_S1 = function( params, vendor, user ){
    /*
     * Calculate the required offer and place it in vendor.offer
     * Use any means necessary. use special properties in the vendor if necessary
     * This method abstracts the technique from the requirement.
     * We could get all the vendors offers here and sort them by stamplist.
     * Or we might store the stamplist pre-ordered by stamps here and only fetch that offer. 
     */
    
}
