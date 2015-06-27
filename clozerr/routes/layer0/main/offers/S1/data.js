var registry = global.registry;
var Q = require("q");

var data_vendor_S1 = function( params, vendor ){
    var deferred = Q.defer();
    /*
     * Fill the raw vendor object with the properties from the
     * server that is required for processing the S1 object further.
     * */
    // For this example fill the object with the offers list.
    debugger;

    vendor = JSON.parse(JSON.stringify(vendor));

    var Offer = registry.getSharedObject("models_Offer");
    debugger;
    
    Offer.find({
        _id:{
            "$in": vendor.offers
            },
        type:"S1"
    }).exec().then( function( offers ){
        console.log(offers);
        debugger;

        vendor.offers = offers;
        debugger;
        deferred.resolve( vendor );
        debugger;

    }, function( err ){
        debugger;
        deferred.resolve({code:500,error:err});
    });
    return deferred.promise;
}

registry.register("data_vendor_S1", {get:data_vendor_S1});
