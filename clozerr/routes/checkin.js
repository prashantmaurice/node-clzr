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
var User = models.User;

var OfferHandler = require("./predicate");


var CHECKIN_STATE_ACTIVE  = 0;
var CHECKIN_STATE_CONFIRMED  = 1;
var CHECKIN_STATE_CANCELLED = 2;

router.get("/create", function( req, res ){
  /*
    TODO: CHECK FOR req.query parameters.
    Throw error if insufficient parameters.
    */

    var errobj = error.err_insuff_params( res, req, ["vendor_id","offer_id","gcm_id"]);
    if(!errobj) {
    //error.err(res,errobj.code,errobj.params);
    return;
  }

  //TODO : Check for duplicates and handle that

  var user = req.user;
  var gcm_id = req.query.gcm_id;

  var obj = { user: req.user };
  Vendor.findOne( { _id:req.query.vendor_id } ).exec().then( function( vendor ){
    debugger;
    obj.vendor = vendor;
    return Offer.findOne( {_id:req.query.offer_id} ).exec();

  }).then( function( offer ) {
    /*
      TODO: Check if offer_id is there in the vendor's current offers.
      */
      obj.offer = offer;
      debugger;
      if( !OfferHandler.qualify( obj.user, obj.vendor, obj.offer ) ){
        // TODO: change error description.
        error.err( res, "671" );
        return;
      }
      debugger;
      var checkin = new CheckIn({
        user: obj.user._id,
        vendor: obj.vendor._id,
        offer: obj.offer._id,
        state: CHECKIN_STATE_ACTIVE,
        date_created: new Date(),
        pin: rack(),
        gcm_id:gcm_id
      });

      checkin.save( function( err, res, num ){
        console.log("Successfully saved checkin");
      });

      res.end( JSON.stringify({ result:true, checkin:checkin }) );
    /*
      TODO: Send alert to Vendor. SocketIO.
      */

    });

});

function sendPushNotification( checkinobj ) {
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

router.get("/validate", function( req, res ){

  var user = req.user;

  // Global memory to be used by the Promise chain.
  var obj = {};

  var errobj = error.err_insuff_params(res,req,["checkin","offer_id"]);
  if(!errobj) {
    return;
  }

  var id = req.query.id;
  var checkin = req.query.checkin;
  User.findOne({_id:user}).exec().then( function( user ){
    obj.user = user;
    return CheckIn.findOne({_id:checkin}).exec();
  }).then( function(){
    obj.checkin = checkin;
    if( !user.type.equals("vendor") ){
          //Throw error.
          error.err(res,"909");
          return;
        }
        if(obj.checkin.vendor == obj.user.vendor_id) {
          // Note: preferably send notification after checkin save in order to make sure the checkin's state is up-to-date.
          obj.checkin.state = CHECKIN_STATE_CONFIRMED;
          obj.checkin.save();

          //Note : There may be a need to modify the parameters to be sent to the notification,
          //depending on what frontend needs.
          sendPushNotification(obj.checkin);

          Offer.findOne( { _id : obj.checkin.offer } ).exec().then(function( offer ){
            obj.offer = offer;
            return Vendor.findOne( { _id : obj.checkin.vendor } ).exec();
          }).then( function( vendor ){
            obj.vendor = vendor;
            OfferHandler.onCheckin( obj.user, obj.offer, obj.vendor );
            obj.user.save();

            res.end( { result: true } );
          });

        }
        else error.err(res,"435");
      });

});

function check_expiry(checkin) {
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


router.get("/active",function(req, res) {
  var user = req.user;
  var userobj = user;
  var ut = userobj.type;

  if( ut == "user" ) {
    CheckIn.find({user:userobj._id, state:CHECKIN_STATE_ACTIVE},function(err,checkins_list) {
      if(err) console.log(err);
      /*var checkins_act_filter = _.filter(checkins_list,function(checkin) {
        return check_activeness(checkin);
      });*/
    res.end(JSON.stringify(checkins_list));
  });
  }
  else if( ut == "vendor" ) {
    debugger;
    CheckIn.find({ vendor : userobj.vendor_id, state:CHECKIN_STATE_ACTIVE},function(err,checkins_list) {
      if(err) console.log(err);
      console.log( checkins_list );

      //Getting all the active checkins

      //Partitioning the active checkins -- based on expiry

      var checkins_filter_exp_arr = _.partition(checkins_list,function(checkin) {
        return check_expiry(checkin);
      });
      //checkins_filter_exp_arr[1] -- setting state to cancelled

      for(var i =0;i<checkins_filter_exp_arr[1].length;i++) {
        var ch = checkins_filter_exp_arr[1][i];
        ch.state = CHECKIN_STATE_CANCELLED;

        //updating the checkin
        ch.save(function(err) {
          if(err) console.log(err);
        });
      }

      res.end(JSON.stringify(checkins_list));
    });
  }

});

router.get("/confirmed",function(req,res) {
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
});

module.exports = router;
