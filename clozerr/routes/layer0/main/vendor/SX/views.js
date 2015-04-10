
var http_vendor_offers_offerPage_SX = function( params, vendor, user ){
    var vendorObjectData = registry.getSharedObject("http_vendor_SX");
    vendorObjectData.get( params, vendor ).then( function( vendor ){
    
    /*
     * Implement SX type vendor's my offers page return.
     */

    }, function( user ){
    
    } );
}

