var registry = global.registry;
var Q = require("q");

var data_vendor_S0 = function( params, vendor ){
    var deferred = Q.defer();

    vendor = JSON.parse(JSON.stringify(vendor));

    var Offer = registry.getSharedObject("models_Offer");
    debugger;
    
    Offer.find({
        _id:{
            $in: vendor.offers,
        },
        type:"S0"
    }).exec().then( function( offers ){
        debugger;

        vendor.offers = offers;
        deferred.resolve( vendor );

    }, function( err ){
        deferred.reject( err );
    });
    return deferred.promise;
}

registry.register("data_vendor_S0", {get:data_vendor_S0});
