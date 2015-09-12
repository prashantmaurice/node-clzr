/**
 *      Documented by Maurice :
 *
 *      This contains all the logic of the different API calls. Use the routes folder only for routing towards different modules
 *      like this. Keep DB structure out of this module and put them in a module under repos so that DB schema change wont affect
 *      this module
 *
 *      This contains all data serving part of Different Vendor related APIs that are used in mobile
 *      in various listings
 */

'use strict';
var deferred = require('../common-utils/deferred');
var fn = require('../common-utils/functions');
var repos = require('./repo/repos.js');
var dataRelatedSettings = require('config').dataRelatedSettings;
//var repos = require('./repo/repos.js');
var moment = require('moment');

function apiResponse(success, result) {
    if (success) {
        return deferred.success({
            status: 'success',
            message: null,
            result: result
        });
    } else {
        return deferred.success({
            status: 'error',
            message: result,
            result: null
        });
    }
}
function apiResponseDeprecated(success,data){
    if(success) return deferred.success(data,200);
    else return deferred.success(data,500);
}


function VendorsAPI() {}


VendorsAPI.prototype.getAllVendors = function(params) {
    return fn.defer(fn.bind(repos.vendorsRepo, 'readAllD'))({ limit : 30}).pipe(function(data){
        return apiResponse(true,data);
    });
};

/**
 *  Search for nearest restaurants, This call is being made from Home page of App
 *
 * @param params
 * @returns {*}
 */
VendorsAPI.prototype.searchNear = function(params) {
    var latitude = params.post.latitude || params.latitude || dataRelatedSettings.defaultSearchLatLong.lat;
    var longitude = params.post.longitude || params.longitude || dataRelatedSettings.defaultSearchLatLong.longg;
    latitude = Number(latitude);
    longitude = Number(longitude);

    return fn.defer(fn.bind(repos.vendorsRepo, 'nearByVendorsD'))({
        offset  :   0,
        limit   :   30,
        lat     :   latitude,
        longg   :   longitude,
        active  :   true
    }).pipe(function(data){

        var result = [];
        data.forEach(function(each){

            var distance = (each.location)?getDistanceFromLatLonInMetre(each.location[0],each.location[1],latitude,longitude):null;
            distance = (distance)?Math.round((distance/1000)*1000)/1000:null;//round it to 3 decimal places
            result.push({
                _id     :   each._id,
                name     :   each.name,
                location     :   each.location,
                distance     :   distance,
                image     :   each.image,
                image_base     :   each.image_base,
                gallery     :   each.gallery,
                address     :   each.address,
                resource_name     :   each._id,
                caption     :   (distance)?distance+" km":"",
                active     :   each.visible,
                geofences     :   each.geofences,
                //TODO : get user data and show whether he has favourited this vendor or not
                favourite     :   (each.favourite)?each.favourite:false
            });
        });


        return apiResponseDeprecated(true,result);
    });
};


//Helper functions
function getDistanceFromLatLonInMetre( lat1, lon1, lat2, lon2 ){
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in Metre
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


module.exports = VendorsAPI;




