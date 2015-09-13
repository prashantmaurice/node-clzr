/**
 *      Documented by Maurice :
 *
 *      This contains all the logic of the different API calls. Use the routes folder only for routing towards different modules
 *      like this. Keep DB structure out of this module and put them in a module under repos so that DB schema change wont affect
 *      this module
 */

'use strict';
var deferred = require('../common-utils/deferred');
var fn = require('../common-utils/functions');
var repos = require('./repo/repos.js');

//var repos = require('./repo/repos.js');
var moment = require('moment');

function apiResponse(success, result, statusCode) {
    statusCode = statusCode || 200;
    if (success) {
        return deferred.success({
            status: 'success',
            message: null,
            result: result
        },statusCode);
    } else {
        return deferred.success({
            status: 'error',
            message: result,
            result: null
        },statusCode);
    }
}

function apiResponseDeprecated(success,data){
    data.statusCode = (success)?200:500;
    return deferred.success(data,200);
}


function UsersAPI() {}


UsersAPI.prototype.getAllUsers = function(params) {
    return fn.defer(fn.bind(repos.usersRepo, 'readAllD'))({ limit : 30}).pipe(function(data){
        return apiResponse(true,data);
    });
};

/**
 *  Get all favourited vendors of the user, This call is being made from Home page of App
 *
 * @param params
 * @returns {*}
 */
UsersAPI.prototype.getFavoutiteVendors = function(params) {
    var access_token = params.access_token;
    return getUserForAccessToken(access_token).pipe(function(userData){
        if(!userData) return apiResponse(false,"Invalid access token : "+access_token);
        return fn.defer(fn.bind(repos.vendorsRepo, 'readVendorsOfIds'))({ vendorIds : userData.favourites}).pipe(function(vendorsArr){
            return apiResponseDeprecated(true,vendorsArr);
        });
    });


    var latitude = params.post.latitude || params.latitude || dataRelatedSettings.defaultSearchLatLong.lat;
    var longitude = params.post.longitude || params.longitude || dataRelatedSettings.defaultSearchLatLong.longg;
    var offset = params.post.offset || params.offset || 0;
    var limit = params.post.limit || params.limit || 10;
    latitude = Number(latitude);
    longitude = Number(longitude);

    return fn.defer(fn.bind(repos.vendorsRepo, 'nearByVendorsD'))({
        offset  :   offset,
        limit   :   limit,
        lat     :   latitude,
        longg   :   longitude,
        active  :   true
    }).pipe(function(data){

        var result = [];
        data.forEach(function(each){

            var distance = (each.location)?getDistanceFromLatLonInMetre(each.location[0],each.location[1],latitude,longitude):null;
            distance = (distance)?Math.round((distance/1000)*1000)/1000:null;//round it to 3 decimal places
            result.push({
                _id         :   each._id,
                name        :   each.name,
                location    :   each.location,
                distance    :   distance,
                image       :   each.image,
                image_base  :   each.image_base,
                gallery     :   each.gallery,
                address     :   each.address,
                resource_name     :   each._id,
                caption     :   (distance)?distance+" km":"",
                active      :   each.visible,
                geofences   :   each.geofences,
                //TODO : get user data and show whether he has favourited this vendor or not
                favourite   :   (each.favourite)?each.favourite:false
            });
        });


        return apiResponseDeprecated(true,result);
    });
};

function getUserForAccessToken(access_token){
    return fn.defer(fn.bind(repos.tokensRepo, 'getUserForTokenD'))({ access_token : access_token}).pipe(function(tokenData){
        if(!tokenData) return deferred.success(null);
        console.log("Token Validation success, token : "+access_token+" & userId : "+tokenData.account.toString());
        return fn.defer(fn.bind(repos.usersRepo, 'readUserOfID'))({ id : tokenData.account}).pipe(function(userData){
            if(!userData) return deferred.success(null);
            console.log("Found user for token : "+access_token+" & name : "+((userData.profile.name)?userData.profile.name:""));
            return deferred.success(userData);
        });
    });
}

module.exports = UsersAPI;




