var registry = global.registry;
var Q = require("q");
var _ = require('underscore')
var fuzzy = require('fuzzy');
var FB = require('fb');
var Twitter = require('twitter'); 
var settings = registry.getSharedObject("settings");
var wa = require('whatsapi');
FB.options({appSecret:'0fa93f920497bc9a26c63d979f840d1f',appId:'643340145745435'});
var client = new Twitter({
  consumer_key: '6slwOZToBf6Zpmm3Y7yTgtxMK',
  consumer_secret: 'BA9eyLuCNm8VNXoCzNslnSXjy4fr6dRq0MPlyol7mZgS94F1xT',
  access_token_key: '3248033851-DFggbOU6HmjhEKK6mczTifALccZnF2qfZv6tew4',
  access_token_secret: 'fHK5hLuKbAD5aAaUqICpizHkJE7yOYmw6m63AFA6sHsiu'
});
var hat = require("hat");
var rack = hat.rack(10, 10);

function getVendorType(vendor) {
    debugger;
    if(vendor.settings.sxEnabled == true || vendor.settings.sxEnabled == "true") {
        return "SX";
    }
    else {
        return "S1";
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
        deferred.reject({code:500,description:"distance params missing"});
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
    return deferred.promise;
}

var view_vendor_search_near=function(params,user){
    /*
    search params :
        name - vendor.name (fuzzy)
        tag - vendor.tags (containing tag)
        category - vendor.category
        */
        var deferred = Q.defer();
        limit=params.limit || registry.getSharedObject("settings").api.default_limit;
        offset=params.offset || 0;
        if(!params.latitude || !params.longitude)
            deferred.reject({code:500,description:"distance params missing"});
        registry.getSharedObject("data_vendor_near").get(params).then(function(vendors){
            return vendors;
        })
        .then(function(vendors){
            debugger;
            if(params.name){
                return _.map(registry.getSharedObject("search").fuzzy(params.name,{
                    list:vendors,
                    extract:function(el){
                        return el.name;
                    }
                }),function(el){
                    return el.original;
                })
                return vendors
            }
            else
                return vendors;
        })
        .then(function(vendors){

            if(params.tag){
                return registry.getSharedObject("data_tag").get({name:params.tag}).then(function(tag){
                    return _.filter(vendors,function(vendor){
                        return vendor.tags.indexOf(tag.id)!=-1
                    })
                })
            } else 
            return vendors;
        })
        .then(function(vendors){
            if(params.category){
                return _.filter(vendors,function(vendor){
                    return vendor.category==params.category
                })
            } else 
            return vendors;
        })
        .then(function(vendors){
            deferred.resolve(_.first(_.rest(
                _.map(vendors,function(vendor){
                    // return vendor
                    return registry.getSharedObject("util").vendorDistDisplay(vendor,params.latitude,params.longitude);
                })
                ,offset),limit))
        })
        return deferred.promise
    }
    var view_vendor_gallery_upload = function(params, user) {
        var deferred = Q.defer();

        registry.getSharedObject()

        return deferred.promise;
    }
    var view_vendor_facebook_promote = function(params,user){
        var deferred = Q.defer();
        FB.setAccessToken(params.fb_token);
        var body = {
          message : params.message,
          picture: params.picture,
          link:params.link,
          name:params.name,
          caption:params.caption,
          description:params.description
      };
      FB.api('/me/feed','post',body,function(result){
        deferred.resolve(result);
    })
      return deferred.promise;
  }
  var view_vendor_twitter_promote = function(params,user){

    var deferred = Q.defer();
    var body={
        status:params.status
    }
    client.post('statuses/update', body,  function(error, tweet, response){
      if(error) throw error;
        console.log(tweet);  // Tweet body. 
        console.log(response);  // Raw response object. 
        deferred.resolve(response);
    });
    return deferred.promise;
}

var view_vendor_checkins_active = function(params, user) {
    var deferred = Q.defer();
    debugger;

    if(user.type == "Vendor") {
        if(user.vendor_id.toString() == params.vendor_id) {
            registry.getSharedObject("data_vendor_checkins_active").get(params).then(function(checkins_filtered) {
                deferred.resolve(checkins_filtered);
            });
        }
        else {
            deferred.resolve({result:false,err:{code:909, message:"Not authorised"}});
        }
    }
    else {
        deferred.resolve({result:false,err:{code:909, message:"Not authorised"}});
    }

    return deferred.promise;
}

var view_vendor_checkins_confirmed = function(params, user) {
    var deferred = Q.defer();
    debugger;

    if(user.type == "Vendor") {
        if(user.vendor_id.toString() == params.vendor_id) {
            registry.getSharedObject("data_vendor_checkins_confirmed").get(params).then(function(checkins_filtered) {
                deferred.resolve(checkins_filtered);
            });
        }
        else {
            deferred.resolve({result:false,err:{code:909, message:"Not authorised"}});
        }
    }
    else {
        deferred.resolve({result:false,err:{code:909, message:"Not authorised"}});
    }

    return deferred.promise;
}

var view_vendor_checkins_cancelled = function(params, user) {
    var deferred = Q.defer();
    debugger;

    if(user.type == "Vendor") {
        if(user.vendor_id.toString() == params.vendor_id) {
            registry.getSharedObject("data_vendor_checkins_cancelled").get(params).then(function(checkins_filtered) {
                deferred.resolve(checkins_filtered);
            });
        }
        else {
            deferred.resolve({result:false,err:{code:909, message:"Not authorised"}});
        }
    }
    else {
        deferred.resolve({result:false,err:{code:909, message:"Not authorised"}});
    }

    return deferred.promise;
}

var view_vendor_details_create = function(params, user) {
    var deferred = Q.defer();
    var Vendor = registry.getSharedObject("models_Vendor");
    var obj = registry.getSharedObject("util").filterObject(params, ["name", "location", "image", "description", "address", "phone"]);

    if(!obj.result) {
        deferred.resolve(obj.err);
    }
    else {
        var vendor_new = new Vendor(obj.data);
        vendor_new.date_created = new Date();
        vendor_new.dateUpdated = vendor_new.date_created;
        vendor_new.resource_name = params.name.toLowerCase();
        vendor_new.visible = true;
        vendor_new.test = false;
        vendor_new.fid = rack();
        debugger;
        vendor_new.save();
        deferred.resolve(vendor_new);
    }

    debugger;

    return deferred.promise;
}
var getBeaconPromise=function(params,user,vendor){
    return registry.getSharedObject("view_vendor_offers_offersPage")
    .get(params,user).then(function(offers){
        return {
            _id: vendor.id,
            beacons: vendor.beacons,
            name: vendor.name,
            settings: vendor.settings,
            hasOffers: (offers.length > 0)
        }
    })
}

var view_vendor_beacons_all = function(params, user) {
    var deferred = Q.defer();
    limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    offset=params.offset || 0;
    vendorPList=[];
    registry.getSharedObject("data_vendors").get().then(function(vendors){
        _.each(vendors,function(vendor){
            // debugger;
            if(vendor.type && vendor.type=="TestVendor") {
                if(user.type && user.type=="TestUser") {
                    params.vendor_id=vendor.id;
                    vendorPList.push(getBeaconPromise(params,user,vendor))
                }
            } else {
                params.vendor_id=vendor.id
                vendorPList.push(getBeaconPromise(params,user,vendor))
            }
        })
        Q.all(vendorPList).then(function(vendorList){
            deferred.resolve({
                UUID:registry.getSharedObject("settings").UUID,
                vendors:vendorList
            })
        })
    })
    return deferred.promise;
}
var view_vendor_geoloc_all = function(params, user) {
    var deferred = Q.defer();
    var vendorPList = [];
    debugger;
    registry.getSharedObject("data_vendors").get().then(function(vendors){
        _.each(vendors,function(vendor){
            debugger;
            if(vendor.type && vendor.type=="TestVendor"){
                if(user.type && user.type=="TestUser"){
                    if(vendor.geoloc && vendor.geoloc==true)
                    vendorPList.push({vendor_id:vendor.id,location:vendor.location,name:vendor.name});
            }
        }
        else
        {   if(vendor.geoloc && vendor.geoloc==true)
            vendorPList.push({vendor_id:vendor.id,location:vendor.location,name:vendor.name})
        }
        })
        Q.all(vendorPList).then(function(vendorList){
            deferred.resolve(vendorList)
        })
    })
    return deferred.promise;
}
global.registry.register("view_vendor_search_name", {get:view_vendor_search_name});
global.registry.register("view_vendor_get_details", {get:view_vendor_get_details});
global.registry.register("view_vendor_list_category", {get:view_vendor_list_category});
global.registry.register("view_vendor_get_homepage", {get:view_vendor_homepage});
global.registry.register("view_vendor_list_near", {get:view_vendor_list_near});
global.registry.register("view_vendor_categories_get", {get:view_vendor_categories_get});
global.registry.register("view_vendor_facebook_promote",{get:view_vendor_facebook_promote});
global.registry.register("view_vendor_twitter_promote",{get:view_vendor_twitter_promote});
global.registry.register("view_vendor_offers_offerspage", {get:view_vendor_offers_offersPage});
global.registry.register("view_vendor_details_update", {get:view_vendor_details_update});
global.registry.register("view_vendor_details_set", {get:view_vendor_details_set});
global.registry.register("view_vendor_search_near", {get:view_vendor_search_near,post:view_vendor_search_near});
global.registry.register("view_vendor_beacons_all", {get:view_vendor_beacons_all});

global.registry.register("view_vendor_checkins_active", {get:view_vendor_checkins_active});
global.registry.register("view_vendor_checkins_confirmed", {get:view_vendor_checkins_confirmed});
global.registry.register("view_vendor_checkins_cancelled", {get:view_vendor_checkins_cancelled});

global.registry.register("view_vendor_details_create", {get:view_vendor_details_create});
global.registry.register("view_vendor_geoloc_all",{get:view_vendor_geoloc_all});

module.exports = {homepage:view_vendor_homepage, offerpage:view_vendor_offers_offersPage};
