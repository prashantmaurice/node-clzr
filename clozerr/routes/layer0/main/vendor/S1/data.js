var registry = global.registry;
var Q = require("q");

var data_vendor_S1 = function( params, vendor ){
    var deferred = Q.defer();
    /*
     * Fill the raw vendor object with the properties from the
     * server that is required for processing the S1 object further.
     * */
    // For this example fill the object with the offers list.

    vendor = JSON.parse(JSON.stringify(vendor));

    var Offer = registry.getSharedObject("models_Offer");
    debugger;
    
    Offer.find({
        _id:{
            "$in": vendor.offers
            }
    }).exec().then( function( offers ){
        console.log(offers);
        debugger;

        vendor.offers = offers;
        deferred.resolve( vendor );

    }, function( err ){
        deferred.reject( err );
    });
    return deferred.promise;
}

registry.register("data_vendor_S1", {get:data_vendor_S1});
