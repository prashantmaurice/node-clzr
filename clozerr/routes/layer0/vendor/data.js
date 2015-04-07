var Q = require("Q");
var registry = globals.registry;


var http_vendor_withOffers = function( params, callback ){
    var _id = params.vendor_id;
    var Vendor = registry.getSharedObject("models_Vendor");
    var Offer = registry.getSharedObject("models_Offer");

    var vendor_obj = null;

    var deferred = Q.defer();

    Vendor.findOne({
        _id:_id
    }).exec().then(function( vendor ){
        vendor_obj = vendor.toJSON();

        var offerList = vendor.offers;
        return Offer.find({
            _id:{
                    _in: offerList
                }
        }).exec();
        
    }, function( err ){

        deferred.reject( err );

    }).then( function( offers ){ 

        vendor_obj.offers = offers;
        deferred.resolve( vendor_obj );

    }, function(err){

        deferred.reject( err );

    });

    return deferred.promise;
}

var data_vendor = function( params, callback ){

    var _id = params.vendor_id;
    var Vendor = registry.getSharedObject("models_Vendor");

    var vendor_obj = null;

    var deferred = Q.defer();

    Vendor.findOne({
        _id:_id
    }).exec().then(function( vendor ){

        vendor_obj = vendor.toJSON();

        var offerList = vendor.offers;
        deferred.resolve( vendor ); 
    }, function( err ){

        deferred.reject( err );

    }); 
    return deferred.promise;

}

globals.registry.register("data_vendor", {get:data_vendor} );

var http_vendor_offers = function( params, callback ){

    var deferred = Q.defer();
    var vendor_link = registry.getSharedObject("http_vendor");

    var vendor_obj = null;

    vendor_link.get( params ).then(function( vendor ){
        vendor_obj = vendor.toJSON();
        return Offer.find({
            _id:{
                "$in":vendor.offers;
                }
        });

    }, function( err ){
        deferred.reject( err );
    }).then(function( offers ){
        vendor_obj.offers = offers;
        deferred.resolv( vendor );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

var data_vendors = function( params ){
    // Use Q promises.
    
    // params has stuff like longitude, latitude, etc.
    // get the vendor list and return it.
    // Only get the list of vendor objects. no need to get offers and all.
    
    var Vendor = registry.getSharedObject("models_Vendor");

    var criteria = {};
    // use params to fill in criteria.

    return Vendor.find( criteria ).exec();
}

registry.register("data_vendors",{get:data_vendors});
