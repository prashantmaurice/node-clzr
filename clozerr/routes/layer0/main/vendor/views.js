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
function removeDuplicatesRewards(user,vendor_id){
    var valid = true;
    if(user.lucky_rewards.length==0)
        return true;
    for(var i=0;i<user.lucky_rewards.length;i++){
        if(user.lucky_rewards[i].id.equals(vendor_id))
            valid = false;
        if(i==user.lucky_rewards.length-1)
            return valid;
    }
}
function removeDuplicatesFailed(user,vendor_id){
    var valid = true;
    if(user.failed_instances.length==0)
        return true;
    for(var i=0;i<user.failed_instances.length;i++){
        if(user.failed_instances[i].id.equals(vendor_id))
            valid = false;
        if(i==user.failed_instances.length-1)
            return valid;
    }
}

var view_vendor_get_details = function( params ) {
    var deferred = Q.defer();

    registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
        deferred.resolve(vendor);
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
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

var view_vendor_details_set = function( params, user ) {
    var deferred = Q.defer();

    var vendorObjectM = registry.getSharedObject("data_vendor");
    var userObjectM = registry.getSharedObject("live_session");

    userObjectM.get( params ).then(function(user) {
        debugger;
        if(user.type == "Vendor") {
            if(user.vendor_id == params.vendor_id) {
               vendorObjectM.get( params ).then(function(vendor) {
                if(params.vendor) {
                    for(key in params.vendor) {
                        vendor[key] = params.vendor[key];
                        vendor.markModified(key);
                    }
                    debugger;
                    vendor.save();
                    debugger;
                    deferred.resolve(vendor);
                }
                else {
                    deferred.reject();
                }
            }, function(err) {
                deferred.reject(err);
            });
           }
           else {
            deferred.reject(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
        }
    }
    else {
        deferred.reject(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
    }
}, function(err) {
    deferred.reject(err);
});

return deferred.promise;

}

var view_vendor_details_update = function( params, user) {
    //params.modify contains the field to be modified
    //params.operation is the operation to be performed -- add , remove
    //params.values contains the array to be added or removed

    var deferred = Q.defer();

    var vendorObjectM = registry.getSharedObject("data_vendor");
    var userObjectM = registry.getSharedObject("live_session");
    var arrayOperations = registry.getSharedObject("arrayOperations");

    userObjectM.get( params ).then(function(user) {
        debugger;
        if(user.type == "Vendor") {
            if(user.vendor_id == params.vendor_id) {
               vendorObjectM.get( params ).then(function(vendor) {
                vendor[params.modify] = arrayOperations[params.operation](vendor[params.modify], params.values);
                vendor.markModified(params.modify);
                vendor.save();
            }, function(err) {
                deferred.reject(err);
            });
           }
           else {
            deferred.reject(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
        }
    }
    else {
        deferred.reject(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
    }
}, function(err) {
    deferred.reject(err);
});

return deferred.promise;

}

var view_vendor_homepage = function( params, user ){
    var deferred = Q.defer();
    
    var vendorObjectsM = registry.getSharedObject("data_vendors");// Data object to get multiple vendors based on certain parameters.
    
    var vendorListF = [];
    vendorObjectsM.get( params ).then(function( vendors ){
        var prList = [];
        debugger;
        for( var i = 0; i < vendors.length; i++ ){
            var typeSpecificM = registry.getSharedObject("view_vendor_homepage_" + vendors[i].type);
            vendor_obj = vendor;
            var fI = i;
            var pr = typeSpecificM.get( params, vendor, user ).then( function( vendor ){ vendorListF[fI] = vendor }, function( err ){ deferred.reject(err); } );
            prList.push( pr );
        }
        return Q.all(prList);
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

var view_vendor_list_category = function(params, user) {
    var deferred = Q.defer();
    debugger;

    params.limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    params.offset=params.offset || 0;

    registry.getSharedObject("data_vendors_category").get(params).then(function(vendors) {
        deferred.resolve(vendors);
    }, function(err) {
        deferred.reject(err);
    });

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
                ,function(vendor){
                    return registry.getSharedObject("util").vendorDistDisplay(vendor,params.latitude,params.longitude);
                }));
        else
            deferred.resolve(_.map(vendors,function(vendor){
                    return registry.getSharedObject("util").vendorDistDisplay(vendor,params.latitude,params.longitude);
                }));
    })
    return deferred.promise;
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
        debugger;
        if(removeDuplicatesFailed(user,vendor._id))
            {   debugger;
                if(removeDuplicatesRewards(user,vendor._id))
                {
                    if(vendor.trials%2==0)
                        {   debugger;
                            user.lucky_rewards.push({id:vendor._id,time:Date.now()});
                            vendor.trials++;
                            user.markModified("lucky_rewards");
                            user.save();
                            valid = true;
                            deferred.resolve(valid);
                        }
                        else
                        {
                            user.failed_instances.push({id:vendor._id,time:Date.now()});
                            vendor.trials++;
                            user.markModified("failed_instances");
                            user.save();
                            valid = false;
                            deferred.resolve(valid);
                        }
                        vendor.save();
                    }
                    else
                    {
                        deferred.resolve("you have tried already and won it");
                    }
                }
                else
                {
                    deferred.resolve("Try again after 24 hours");
                }
            });
return deferred.promise;
}

var view_vendor_categories_get = function(params,user) {
    return Q(registry.getSharedObject("settings").categories)
}
var view_vendor_search_name=function(params,user){
    var deferred = Q.defer();
    limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    offset=params.offset || 0;
    registry.getSharedObject("data_vendors").get().then(function(vendors){
        // console.log(vendors[0])
        result = _.first(_.rest(fuzzy.filter(params.text,vendors,
            {extract:function(el){
                return el.name;
            }}),offset),limit);
        deferred.resolve(_.map(result,function(el){
            // return el;
            return registry.getSharedObject("util").vendorDistDisplay(el.original,params.latitude,params.longitude);
        }))
    })
    return deferred.promise
}
global.registry.register("view_vendor_search_name", {get:view_vendor_search_name});
global.registry.register("view_vendor_get_details", {get:view_vendor_get_details});
global.registry.register("view_vendor_lucky_checkin",{get:view_vendor_lucky_checkin});
global.registry.register("view_vendor_list_category", {get:view_vendor_list_category});
global.registry.register("view_vendor_get_homepage", {get:view_vendor_homepage});
global.registry.register("view_vendor_list_near", {get:view_vendor_list_near});
global.registry.register("view_vendor_categories_get", {get:view_vendor_categories_get});
global.registry.register("view_vendor_offers_offerspage", {get:view_vendor_offers_offersPage});
global.registry.register("view_vendor_details_update", {get:view_vendor_details_update});
global.registry.register("view_vendor_details_set", {get:view_vendor_details_set});

module.exports = {homepage:view_vendor_homepage, offerpage:view_vendor_offers_offersPage};