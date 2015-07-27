var registry = global.registry;
var Q = require("q");
var _ = require("underscore");
var request = require('request');

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

var CheckIn = registry.getSharedObject("models_Checkin");

var policyCheckTimeDelayBetweenCheckins = function( user, vendor, offer ) {

  var deferred = Q.defer();
  debugger;
  CheckIn.find( { user:user._id, vendor:vendor._id, state:CHECKIN_STATE_CONFIRMED} ).sort("-date_created").exec().then(function( checkins ){
    debugger;
    var checkin = checkins[0];
    debugger;

    console.log( checkins );
    console.log( checkins[0] );
    if( !checkin || !checkin.date_created){
      console.log(" policyCheckTimeDelayBetweenCheckins : true")
      deferred.resolve( true );
    }
    console.log( new Date().getTime() );
    console.log( new Date().getTime() - checkin.date_created.getTime() ); 

    if( Math.abs( new Date().getTime() - checkin.date_created.getTime() ) < registry.getSharedObject("settings").checkin.delay_between_checkins ) {
      console.log(" policyCheckTimeDelayBetweenCheckins : false")
      deferred.resolve( false );
    }
    else{
      console.log(" policyCheckTimeDelayBetweenCheckins : true")
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
      console.log(" policyCheckDuplicateCheckins : true")
      deferred.resolve( checkin );
    }
    else{
      console.log(" policyCheckDuplicateCheckins : false")
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
    if(!arr1)
      arr1=[]
    console.log('adding '+JSON.stringify(arr1)+' and '+JSON.stringify(arr2))
    arr1 = arr1.concat(arr2);
    console.log('result '+JSON.stringify(arr1))
    return arr1;
  },
  "remove" : function(arr1, arr2) {
    if(!(arr2 instanceof Array))
      arr2=[arr2]
    console.log('removing '+JSON.stringify(arr2)+' from '+JSON.stringify(arr1))
    for(var i=0; i<arr2.length; i++) {
      var idx = arr1.indexOf(arr2[i]);
      if(idx != -1) {
        arr1.splice(idx,1);
      }
    }
    console.log('result '+JSON.stringify(arr1))
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
  return Math.round((dist*1000))/1000.0
}
function getDistance(latitude,longitude,vendor){
  return distance(latitude,longitude,vendor.location[0],vendor.location[1]);
}
function vendorDisplay(vendor){
  return {
    _id:vendor.id,
    name:vendor.name,
    location:vendor.location,
    image:vendor.image,
    image_small:vendor.image_small,
    gallery:vendor.gallery,
  }
}
function vendorDistDisplay(vendor,latitude,longitude){
  return {
    _id:vendor.id,
    name:vendor.name,
    location:vendor.location,
    distance:getDistance(latitude,longitude,vendor),
    image:vendor.image,
    image_small:vendor.image_small,
    gallery:vendor.gallery,
    address:vendor.address,
    club_members:vendor.club_members,
    resource_name:vendor.resource_name
  }
}
function geoLocate(address){
  var deferred=Q.defer();
  request.get({url:"https://maps.googleapis.com/maps/api/geocode/json?address="+address},
    function(err,response,body){
    if(err){
      console.log("error : "+err)
      return;
    }
    latlng=JSON.parse(body).results[0].geometry.location
    deferred.resolve([latlng.lat,latlng.lng])
  })
  return deferred.promise;
}
function getRouteDistance(lat1,lng1,lat2,lng2){
  var deferred=Q.defer();
  request.get({url:"https://maps.googleapis.com/maps/api/directions/json?origin=loc:"+lat1+"N"+lng1+"E&destination="+lat2+"N"+lng2+"E"},
    function(err,response,body){
    if(err){
      console.log("error : "+err)
      return;
    }
    dist_m=JSON.parse(body).routes[0].legs[0].distance.value;
    deferred.resolve(dist_m)
  })
  return deferred.promise;
}
function getCheckinSuccessMessage(checkin){
  return "Successfully checked in"
}

function filterObject(raw, fields,strict) {
  var obj = {};
  var missingParams = [];
  if(!strict) strict=true
  for(var i=0; i<fields.length; i++) {
    var field = fields[i];
    if(raw[field]) {
      obj[field] = raw[field];
    }
    else {
      missingParams.push(field);
    }
  }

  if(missingParams.length&&strict) {
    return {result:false, err:{code:420, message:"Insufficient parameters passed.", missingParams:missingParams}};
  }
  else {
    return {result:true, data:obj};
  }
}

module.exports = {
  getVendorNearDisplay:getVendorNearDisplay,
  policyCheckTimeDelayBetweenCheckins:policyCheckTimeDelayBetweenCheckins,
  policyCheckDuplicateCheckins:policyCheckDuplicateCheckins,
  vendorDisplay:vendorDisplay,
  vendorDistDisplay:vendorDistDisplay,
  arrayOperations:arrayOperations,
  getCheckinSuccessMessage:getCheckinSuccessMessage,
  filterObject:filterObject,
  patchObject:patchObject
}

function patchObject( obj, patch ){
	for( var key in patch ){
		console.log(key);
		if( !( ( typeof patch[key] ) in {"boolean":1,"string":1,"number":1,"function":1} ) ){
			obj[key] = patchObject( obj[key]||{}, patch[key] );
		}else{
			// Handle mongoose objects.
			console.log(" patching key: " + key );
			obj[key] = patch[key];	
		}
		console.log( obj );
		console.log( key );
		if( obj.markModified ){
			console.log("marking modified: " + key);
			obj.markModified( key );
		}
	}
	return obj
}

registry.register("util", module.exports);
