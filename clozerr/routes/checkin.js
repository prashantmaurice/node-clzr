var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Q = require("q");
var error = require("./error");
var hat = require("hat");
var rack = hat.rack(10,10);

var Vendor = models.Vendor;
var Offer = models.Offer;
var CheckIn = models.CheckIn;


const var CHECKIN_STATE_ACTIVE  = 0;
const var CHECKIN_STATE_CONFIRMED  = 1;
const var CHECKIN_STATE_CANCELLED = 2;

router.get("check-in", function( req, res ){
  /*
    TODO: CHECK FOR req.query parameters.
    Throw error if insufficient parameters.
  */
  if(!(req.query.user && req.query.vendor_id && req.query.offer_id))
    error.err(res,"420");
  var user = req.user;
  var data1;
  Vendor.find( {"_id":req.query.vendor_id} ).exec().then( function( res ,data){
    data1=data;
    return Offer.find( {"_id":req.query.offer_id} ).exec();
  }
  ).then( function( res ,data) {
    /*
      TODO: Check if offer_id is there in the vendor's current offers.
    */
    checkConditions(user,data1,data);
    if( !checkConditions( user, vendor, offer ) ){
          // TODO: Throw Error.
          error.err(res,"671");
    }
  }
  
    var checkin = new CheckIn({
      user:user._id,
      vendor:vendor._id,
      offer:offer._id,
      state: CHECKIN_STATE_ACTIVE,
      date_created: new Date();
      pin: rack();
    });

    checkin.save().then( function( res ){
          console.log("Successfully saved checkin")
    }, function( err ){
          console.log("Error saving checkin");
          console.log(err);
    });

    /*
      TODO: Send alert to Vendor. SocketIO.
    */

  );

});

router.get("validate", function( req, res ){
  /*
    TODO: Check request parameters.
  */
  if(req.query.)


});
