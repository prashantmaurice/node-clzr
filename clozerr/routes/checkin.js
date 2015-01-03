var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Q = require("q");
var error = require("./error");
var hat = require("hat");
var rack = hat.rack(10,10);
var gcm = require("node-gcm");

var Vendor = models.Vendor;
var Offer = models.Offer;
var CheckIn = models.CheckIn;


const var CHECKIN_STATE_ACTIVE  = 0;
const var CHECKIN_STATE_CONFIRMED  = 1;
const var CHECKIN_STATE_CANCELLED = 2;

router.get("checkin/create", function( req, res ){
  /*
    TODO: CHECK FOR req.query parameters.
    Throw error if insufficient parameters.
  */

  if(!(req.query.vendor_id && req.query.offer_id && req.query.gcm_id))

    error.err(res,"420");

  var user = req.user;

  var gcm_id = req.query.gcm_id;

  Vendor.find( {"_id":req.query.vendor_id} ).exec().then( function( res ,vendor_s){

    return Offer.find( {"_id":req.query.offer_id} ).exec();
  }
  ).then( function( res ,data) {
    /*
      TODO: Check if offer_id is there in the vendor's current offers.
    */
    checkConditions(user,vendor_s,data);
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
      date_created: new Date(),
      pin: rack(),
      gcm_id:gcm_id
    });

    checkin.save().then( function( res ){
          console.log("Successfully saved checkin");
    }, function( err ){
          console.log("Error saving checkin");
          console.log(err);
    });

    /*
      TODO: Send alert to Vendor. SocketIO.
    */

  );

});

function sendPushNotification(var checkinobj) {
  var message = new gcm.Message({
    collapseKey: 'Stamps updated !',
    delayWhileIdle: true,
    data: {
      "key": "checkin_push",
      "checkinobj": checkinobj
    }
  });

  var sender = new gcm.Sender('key');             //Insert Google Server API Key
  var regIds = [];
  regIds.push(checkinobj.gcm_id);                 //Insert Registration ID

  sender.send(message, regIds, 4, function(err,res) {
    console.log(res);
    if(err) console.log(err);
  });
}

router.get("checkin/validate", function( req, res ){

  var user = req.user;

  if(!req.query.id || !req.query.checkin){
    error.err( res, "435" );
  }
    var id = req.query.id;
    var checkin = req.query.checkin;
    var userobj = User.findOne({_id:user});
    var ut = userobj.type;
    if( ut.equals("v") ){
      var checkinobj = CheckIn.findOne({_id:checkin});
      if(checkinobj.vendor == userobj.vendor_id) {

        //TODO : Send a push notification based on gcm_id of checkin

        sendPushNotification(checkinobj);

        //TODO : Update checkinobj's state to CONFIRMED.

        console.log("checkin validated for : " + checkinobj.user + ", by " + checkinobj.vendor);
      }
      else error.err(res,"435");
    }

});

function check_validity(checkin) {
  if(parse(new Date()) - parse(checkin.date_created)<1000000) return true;
  else return false;
}

function check_activeness(checkin) {
  if(checkin.state==CHECKIN_STATE_ACTIVE) return true;
  else return false;
}

function check_confirmed(checkin) {
  if(checkin.state==CHECKIN_STATE_CONFIRMED) return true;
  else return false;
}

router.get("checkin/active",function(req, res) {
  var user = req.user;
  var userobj = User.findOne({_id:user});
  var ut = userobj.type;

  if(ut.equals("u")) {
    CheckIn.find({user:userobj._id},function(err,checkins_list) {
      if(err) console.log(err);
      var checkins_act_filter = _.filter(checkins_list,function(checkin) {
        return check_activeness(checkin);
      });
      res.send(JSON.stringify(checkins_act_filter));
    });
  }
  else if(ut.equals("v")) {
    CheckIn.find({vendor:userobj.vendor_id},function(err,checkins_list) {
      if(err) console.log(err);
      var checkins_filter = _.filter(checkins_list,function(checkin) {
        return check_validity(checkin);
      });
      checkins_filter = _.filter(checkins_filter,function(checkin) {
        return check_activeness(checkin);
      });
      res.send(JSON.stringify(checkins_filter));
    });
  }

});

router.get("checkin/confirmed",function(req,res) {
  var user = req.user;
  var userobj = User.findOne({_id:user});
  var ut = userobj.type;

  if(ut.equals("v")) {

    CheckIn.find({vendor:userobj.vendor_id},function(err,checkins_list) {
      if(err) console.log(err);
        var checkins_conf_filter = _.filter(checkins_list,function(checkin) {
          return check_confirmed( checkin );
        });
      res.send(JSON.stringify(checkins_conf_filter));
    });

  }else{
    error.err(res,"909");
  }
  }
});
