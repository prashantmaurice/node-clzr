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



router.get("check-in", function( req, res ){
  /*
    TODO: CHECK FOR req.query parameters.
    Throw error if insufficient parameters.
  */

  var user = req.user;
  
  Vendor.find({"_id":req.query.vendor_id}).exec().then(
    return Offer.find( {"_id":req.query.offer_id} ).exec();
  ).then(

  );

});
