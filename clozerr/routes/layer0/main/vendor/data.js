var Q = require("q");
var registry = global.registry;
var ObjectId = require('mongoose').Types.ObjectId;

var data_vendor_withOffers = function( params ){
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
                    $in: offerList
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

var data_vendor = function( params){
    var _id = params.vendor_id;
    var Vendor = registry.getSharedObject("models_Vendor");
    var vendor_obj = null;
    var deferred = Q.defer();
    if( !_id ){
        return Q.fcall(function(){ throw new Error( "Vendor_id missing" ); });
    }

    debugger;
    
    Vendor.findOne({
        _id: new ObjectId(_id)
    }).exec()
    .then(function( vendor ){
        deferred.resolve( vendor ); 
    }, function( err ){
        deferred.reject( err );
    }); 
    return deferred.promise;
}
var data_vendor_near = function( params ){
    var Vendor = registry.getSharedObject("models_Vendor");
    var deferred = Q.defer();
    Vendor.find({
        location: {
            $near: [params.latitude, params.longitude]
        },
        visible:true
    }).limit(params.limit ).skip(params.offset ).exec()
    .then(function( vendor ){
        deferred.resolve( vendor ); 
    }, function( err ){
        deferred.reject( err );
    }); 
    return deferred.promise;
}

global.registry.register("data_vendor", {get:data_vendor} );

var http_vendor_offers = function( params){

    var deferred = Q.defer();
    var vendor_link = registry.getSharedObject("data_vendor");

    var vendor_obj = null;

    vendor_link.get( params ).then(function( vendor ){
        vendor_obj = vendor.toJSON();
        return Offer.find({
            _id:{
                "$in":vendor.offers
                }
        });

    }, function( err ){
        deferred.reject( err );
    }).then(function( offers ){
        vendor_obj.offers = offers;
        deferred.resolve( vendor );
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

var data_vendors_category = function( params ) {
    var Vendor = registry.getSharedObject("models_Vendor");

    return Vendor.find({category: params.category}).limit(params.limit).skip(params.offset).exec();
}

registry.register("data_vendors",{get:data_vendors});
registry.register("data_vendor_near",{get:data_vendor_near});
registry.register("data_vendor_withOffers",{get:data_vendor_withOffers});
registry.register("data_vendors_category",{get:data_vendors_category});
