var registry = global.registry;
var Q = require("q");
var _ = require('underscore')
var fuzzy = require('fuzzy');

function getVendorType(vendor) {
    console.log('in getVendorType');
    debugger;
    if(vendor.settings.sxEnabled == true || vendor.settings.sxEnabled == "true") {
        console.log("SX");
        return "SX";
    }
    else {
        console.log("S1");  
        return "S1";
    }
}

var view_vendor_offers_offersPage = function( params ){
    console.log("OfferPage Main View");
    var deferred = Q.defer();

    console.log(params);

    var vendorObjectM = registry.getSharedObject("data_vendor");
    var userObjectM = registry.getSharedObject("live_session");

    var vendor_obj = null;
    vendorObjectM.get( params ).then(function( vendor ){
        vendor_obj = vendor.toJSON();
        debugger;
        return userObjectM.get( params );
    }, function( err ){
        deferred.reject( err );
    }).then( function( user ){
        var typeSpecificM = registry.getSharedObject("view_vendor_offers_offersPage_" + getVendorType(vendor_obj));
        debugger;
        return typeSpecificM.get( params, vendor_obj, user );
    }, function( err ){
        console.log(err);
        deferred.reject( err );
    })
    .then(function( res ){deferred.resolve( res )}, function( err ){ deferred.reject( err ) });
    console.log('returning from view_vendor_offers_offersPage');
    return deferred.promise;

}

global.registry.register("view_vendor_offers_offerspage", {get:view_vendor_offers_offersPage});
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
var view_vendor_list_near = function(params,user){
    var deferred = Q.defer();
    var vendors = registry.getSharedObject("data_vendor_near");
    params.limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    params.offset=params.offset || 0;
    if(!params.latitude || !params.longitude)
        deferred.reject("distance params missing");
    vendors.get(params).then(function(vendors){
        if(params.category)
            deferred.resolve(_.map(
                _.filter(vendors,function(vendor){return vendor.category==params.category})
                ,registry.getSharedObject("util").getVendorNearDisplay));
        else
            deferred.resolve(_.map(vendors,registry.getSharedObject("util").getVendorNearDisplay));
    })
    return deferred.promise
}
var view_vendor_get_categories=function(params,user){
    return Q(registry.getSharedObject("settings").categories)
}
var view_vendor_name_search=function(params,user){
    var deferred = Q.defer();
    registry.getSharedObject("data_vendors").get().then(function(vendors){
        // console.log(vendors[0])
        result = fuzzy.filter(params.text,vendors,
            {extract:function(el){
                return el.name;
            }});
        deferred.resolve(_.map(result,function(el){
            return el.original;
        }))
    })
    return deferred.promise
}
global.registry.register("view_vendor_get_homepage", {get:view_vendor_homepage});
global.registry.register("view_vendor_list_near", {get:view_vendor_list_near});
global.registry.register("view_vendor_get_categories", {get:view_vendor_get_categories});
global.registry.register("view_vendor_name_search", {get:view_vendor_name_search});

module.exports = {homepage:view_vendor_homepage, offerpage:view_vendor_offers_offersPage};
