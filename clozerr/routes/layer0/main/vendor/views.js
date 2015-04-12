var registry = global.registry;
var Q = require("q");

var view_vendor_offers_offersPage = function( params ){
    console.log("OfferPage Main View");
    var deferred = Q.defer();

    var vendorObjectM = registry.getSharedObject("data_vendor");
    var userObjectM = registry.getSharedObject("util_session");

    var vendor_obj = null;
    vendorObjectM.get( params ).then(function( vendor ){
        vendor_obj = vendor;
        return userObjectM.get( params );
    }, function( err ){
        deferred.reject( err );
    }).then( function( user ){

        var typeSpecificM = registry.getSharedObject("view_vendor_offers_offersPage_" + vendor.type);
        return typeSpecificM.get( params, vendor_obj, user );
    }, function( err ){
        deferred.reject( err );
    })
    .then(function( res ){deferred.resolve( res )}, function( err ){ deferred.reject( err ) });
    
    return deferred.promise;

}

global.registry.register("view_vendor_offers_offersPage", {get:view_vendor_offers_offersPage});
// Put other vendor types here.

var view_vendor_homepage = function( params, user ){
    var deferred = Q.defer();
    
    var vendorObjectsM = registry.getSharedObject("data_vendors");// Data object to get multiple vendors based on certain parameters.
    
    var vendorListF = [];
    vendorObjectsM.get( params ).then(function( vendors ){
        var prList = [];
        debugger;
        for( var i = 0; i < params.length; i++ ){
            var typeSpecificM = registry.getSharedObject("view_vendor_homepage_" + vendors[i].type);
            vendor_obj = vendor;
            var fI = i;
            var pr = typeSpecificM.get( params, vendor, user ).then( function( vendor ){ vendorListF[fI] = vendor }, function( err ){ deferred.reject(err); } );
            prList.push( pr );
        }
        return Q.all()
    }, function( err ){
        debugger;
        deferred.reject( err );
    }).then( function( user ){
        deferred.resolve( vendorListF );
    }, function( err ){
        deferred.reject( err );
    }).done();

    return deferred.promise;
}

