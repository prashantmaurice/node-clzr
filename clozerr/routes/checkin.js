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

var OfferHandler = require("./predicate");


const var CHECKIN_STATE_ACTIVE  = 0;
const var CHECKIN_STATE_CONFIRMED  = 1;
const var CHECKIN_STATE_CANCELLED = 2;

router.get("checkin/create", function( req, res ){
  /*
    TODO: CHECK FOR req.query parameters.
    Throw error if insufficient parameters.
  */

  var errobj = error.err_insuff_params(req.query,["vendor_id","offer_id","gcm_id"]);
  if(errobj) {
    error.err(res,errobj.code,errobj.params);
    return;
  }

  var user = req.user;
  var gcm_id = req.query.gcm_id;

  var obj = { user: req.user };
  Vendor.find( {"_id":req.query.vendor_id} ).exec().then( function( res ,vendor){
    obj.vendor = vendor;
    return Offer.find( {"_id":req.query.offer_id} ).exec();

  }).then( function( res , offer ) {
    /*
      TODO: Check if offer_id is there in the vendor's current offers.
    */
    obj.offer = offer;
    if( !OfferHandler.qualify( obj.user, obj.vendor, obj.offer ) ){
          error.err( res, "671" );
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

    res.end( JSON.stringify({ result:true, checkin:checkin }) );
    /*
      TODO: Send alert to Vendor. SocketIO.
    */

  });

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

  // Global memory to be used by the Promise chain.
  var obj = {};

  if(!req.query.id || !req.query.checkin){
    // TODO: Change this error code.
    error.err( res, "435" );
  }

    var id = req.query.id;
    var checkin = req.query.checkin;
    User.findOne({_id:user}).exec().then( function( user ){
        obj.user = user;
        return CheckIn.findOne({_id:checkin}).exec();
    }).then( function(){
        obj.checkin = checkin;
        if( !user.type.equals("vendor") ){
          // TODO: Throw error.
        }
        if(obj.checkin.vendor == obj.user.vendor_id) {
          
          // Note: preferably send notification after checkin save in order to make sure the checkin's state is up-to-date.
          obj.checkin.state = CHECKIN_STATE_CONFIRMED;
          obj.checkin.save();
          sendPushNotification(obj.checkin);

        }
        else error.err(res,"435");
    });

});

function check_validity(checkin) {
  if(parse(new Date()) - parse(checkin.date_created) < 1000000) return true;
  else return false;
}

function check_activeness(checkin) {
  if(checkin.state == CHECKIN_STATE_ACTIVE) return true;
  else return false;
}

function check_confirmed(checkin) {
  if(checkin.state == CHECKIN_STATE_CONFIRMED) return true;
  else return false;
}
                                                                                                                                                                                                  
router.get("checkin/active",function(req, res) {
  var user = req.user;
  var userobj = User.findOne({_id:user});
  var ut = userobj.type;

  if(ut.equals("user")) {
    CheckIn.find({user:userobj._id, type:CHECKIN_STATE_ACTIVE},function(err,checkins_list) {
      if(err) console.log(err);
      /*var checkins_act_filter = _.filter(checkins_list,function(checkin) {
        return check_activeness(checkin);
      });*/
      res.send(JSON.stringify(checkins_list));
    });
  }
  else if(ut.equals("vendor")) {
    CheckIn.find({ vendor : userobj.vendor_id, type:CHECKIN_STATE_ACTIVE},function(err,checkins_list) {
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

})

router.get("checkin/confirmed",function(req,res) {
  var user = req.user;
  var userobj = User.findOne({_id:user});
  var ut = userobj.type;

  if(ut.equals("vendor")) {

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
