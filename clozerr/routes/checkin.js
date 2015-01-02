var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Q = require("q");
var error = require("./error");

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

  var user = req.user;

  Vendor.find( {"_id":req.query.vendor_id} ).exec().then(
    return Offer.find( {"_id":req.query.offer_id} ).exec();
  ).then(
    /*
      TODO: Check if offer_id is there in the vendor's current offers.
    */
    if( !checkEligibility( user, vendor, offer ) ){
          // TODO: Throw Error.
    }
    var checkin = new CheckIn({
      user:user._id,
      vendor:vendor._id,
      offer:offer._id,
      state: CHECKIN_STATE_ACTIVE,
    });


    /*
      TODO:
    */


  );

});
