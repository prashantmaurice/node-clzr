var registry = global.registry;
var Q = require("q");
var _ = require('underscore')

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

var view_vendor_lucky_checkin  = function(params,user){
    var deferred = Q.defer();
    var vendorObj = registry.getSharedObject("data_vendor");
    var valid ;
    debugger;
    if(!user.lucky_rewards)
    {
        user.lucky_rewards = [];
    }
    if(!user.failed_instances)
    {
        user.failed_instances = [];
    }
    vendorObj.get(params).then(function(vendor){
        if(!vendor.trials)
            vendor.trials = 0;
        if(vendor.trials%2==0)
        {
            debugger;
            user.lucky_rewards.push({id:vendor._id,time:Date.now()});
            vendor.trials++;
            debugger;
            user.save();
            valid = true;
        }
        else
        {
            debugger;
            user.failed_instances.push({id:vendor._id,time:Date.now()});
            vendor.trials++;
            debugger;
            user.save();
            debugger;
            valid = false;
        }
        deferred.resolve(valid);
    });
    return deferred.promise;
}
global.registry.register("view_vendor_lucky_checkin",{get:view_vendor_lucky_checkin});
var view_vendor_get_categories=function(params,user){
    return Q(registry.getSharedObject("settings").categories)
}
global.registry.register("view_vendor_get_homepage", {get:view_vendor_homepage});
global.registry.register("view_vendor_list_near", {get:view_vendor_list_near});
global.registry.register("view_vendor_get_categories", {get:view_vendor_get_categories});

module.exports = {homepage:view_vendor_homepage, offerpage:view_vendor_offers_offersPage};
