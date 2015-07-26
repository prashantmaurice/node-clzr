var registry = global.registry;
var Q = require("q");

var data_vendor_S0 = function( params, vendor ){

    vendor = JSON.parse(JSON.stringify(vendor));

    var Offer = registry.getSharedObject("models_Offer");
    
    if( !vendor )
        throw { code:321, description:"No such vendors." };

    return Offer.find({
        _id:{
            $in: vendor.offers,
        },
        type:"S0"
    }).exec().then( function( offers ){

        vendor.offers = offers;
        return Q(vendor);

    });
}

registry.register("data_vendor_S0", { get:data_vendor_S0 });
