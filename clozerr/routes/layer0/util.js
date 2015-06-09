var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var CheckIn = registry.getSharedObject("models_Checkin");

var policyCheckTimeDelayBetweenCheckins = function( user, vendor, offer ) {

  var deferred = Q.defer();
  debugger;
  CheckIn.find( { user:user._id, vendor:vendor._id, state:CHECKIN_STATE_CONFIRMED} ).sort("date_created").exec().then(function( checkins ){
    debugger;
    var checkin = checkins[0];
    debugger;

    if( !checkin ){
      deferred.resolve( true );
    }

    if( Math.abs( new Date().getTime() - checkin.date_created.getTime() ) < registry.getSharedObject("settings").checkin.delay_between_checkins ) {
      deferred.resolve( false );
    }
    else{
      deferred.resolve( true );
    }
  });

  return deferred.promise;

}

var policyCheckDuplicateCheckins = function( user, vendor, offer ) {

  var deferred = Q.defer();
  debugger;
  CheckIn.findOne( { user:user._id, vendor:vendor._id, offer:offer._id, state:CHECKIN_STATE_ACTIVE} ).exec().then(function( checkin ){

    debugger;
    if( checkin ) {
      deferred.resolve( checkin );
    }
    else{
      deferred.resolve( );
    }

  });

  return deferred.promise;

}

var getVendorNearDisplay=function(vendor){
  var retVendor={
    _id:vendor._id||0,
    name:vendor.name||0,
    address:vendor.address||0,
    visible:vendor.visible||0,
    settings:vendor.settings||{}
  };
  return retVendor;
}

var arrayOperations =  {
  "add" : function(arr1, arr2) {
    arr1 = arr1.concat(arr2);
    return arr1;
  },
  "remove" : function(arr1, arr2) {
    for(var i=0; i<arr2.length; i++) {
      var idx = arr1.indexOf(element);
      if(idx != -1) {
        arr1.splice(idx, 1);
      }
    }
    return arr1;
  }
}

var makeFacebookPost = function(user, access_token, message, place) {
  var https = require('https');

  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: '/'+user.profile.id+'/feed?access_token='+access_token,
    method: 'POST',
    headers: { 'message': message, 'place': place }
  };

  var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(data) {
      console.log(data);
    });
  });
  req.end();
}

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344
  return dist
}
function getDistance(latitude,longitude,vendor){
  return distance(latitude,longitude,vendor.location[0],vendor.location[1]);
}
function vendorDisplay(vendor){
  return {
    _id:vendor.id,
    name:vendor.name,
    location:vendor.location,
    image:vendor.image
  }
}
function vendorDistDisplay(vendor,latitude,longitude){
  return {
    _id:vendor.id,
    name:vendor.name,
    location:vendor.location,
    distance:getDistance(latitude,longitude,vendor),
    image:vendor.image
  }
}
module.exports = {
  getVendorNearDisplay:getVendorNearDisplay,
  policyCheckTimeDelayBetweenCheckins:policyCheckTimeDelayBetweenCheckins,
  policyCheckDuplicateCheckins:policyCheckDuplicateCheckins,
  vendorDisplay:vendorDisplay,
  vendorDistDisplay:vendorDistDisplay,
  arrayOperations:arrayOperations,
}

registry.register("util", module.exports);