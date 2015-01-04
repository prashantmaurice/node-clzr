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

    var errobj = error.err_insuff_params( res, req, ["vendor_id","offer_id"]);//,"gcm_id"]);
if(!errobj) {
    //error.err(res,errobj.code,errobj.params);
    return;
  }

  //TODO : Check for duplicates and handle that

  var user = req.user;
  var gcm_id = req.query.gcm_id || 0;

  var obj = { user: req.user };
  Vendor.findOne( { _id:req.query.vendor_id } ).exec().then( function( vendor ){
    debugger;
    obj.vendor = vendor;
    return Offer.findOne( {_id:req.query.offer_id} ).exec();

  }).then( function( offer ) {
    /*
      TODO: Check if offer_id is there in the vendor's current offers.
      */
      if( !offer ){
        // error.
      }
      obj.offer = offer;
      debugger;
      if( !OfferHandler.qualify( obj.user, obj.vendor, obj.offer ) ){
        // TODO: change error description.
        error.err( res, "568" );
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

  if( !(req.user.type == "vendor") ){
          //Throw error.
          error.err(res,"909");
          return;
        }

  var userOfVendor = req.user;


  // Global memory to be used by the Promise chain.
  var obj = { userOfVendor: userOfVendor };


  var errobj = error.err_insuff_params(res,req,["checkin_id"]);
  if(!errobj) {
    return;
  }
  debugger;
  //var id = req.query.offer_id;
  //var checkin = req.query.checkin_id;
  CheckIn.findOne({_id:req.query.checkin_id}).exec().then( function( checkin ){
    debugger;
    obj.checkin = checkin;
    return User.findOne({_id:checkin.user.toString()}).exec();
  }, function( err ){
    // Throw
    console.log( err );
  }).then( function( user ){
    //  if(err) error.err(res,"302");
    //debugger;
    obj.user = user;
    
        //debugger;
        if(obj.checkin.vendor.toString() == obj.userOfVendor.vendor_id) {
          // Note: preferably send notification after checkin save in order to make sure the checkin's state is up-to-date.
          obj.checkin.state = CHECKIN_STATE_CONFIRMED;
          obj.checkin.save();

          //Note : There may be a need to modify the parameters to be sent to the notification,
          //depending on what frontend needs.
          //sendPushNotification(obj.checkin);

          Offer.findOne( { _id : obj.checkin.offer } ).exec().then(function( offer ){
            obj.offer = offer;
            return Vendor.findOne( { _id : obj.checkin.vendor } ).exec();
          }).then( function( vendor ){
            obj.vendor = vendor;
            debugger;
            OfferHandler.onCheckin( obj.user, obj.vendor, obj.offer );
            debugger;
            obj.user.save();

            res.end( JSON.stringify({ result: true }) );
          });

        }
        else error.err(res,"435");
      }, function( err ){
        // throw.
        console.log( err );
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
  var chdummy = {};
  var chdummy_ret_arr = [];

  if( ut == "user" ) {
    CheckIn.find({user:userobj._id, state:CHECKIN_STATE_ACTIVE},function(err,checkins_list) {
      if(err) console.log(err);
      /*var checkins_act_filter = _.filter(checkins_list,function(checkin) {
        return check_activeness(checkin);
      });*/
    var len = checkins_list.length;
    for(var i=0;i<len;i++) {
      var ch = checkins_list[i];
      chdummy._id = ch._id;
      chdummy.state = ch.state;
      chdummy.pin = ch.pin;
      chdummy.date_created = ch.date_created;
      chdummy.gcm_id = ch.gcm_id;
      chdummy.vendor = Vendor.findOne({_id:ch.vendor},function(err) {
        if(err) console.log(err);
      });
      chdummy.user = User.findOne({_id:ch.user},function(err) {
        if(err) console.log(err);
      });
      chdummy.offer = Offer.findOne({_id:ch.offer},function(err) {
        if(err) console.log(err);
      });
      chdummy_ret_arr.push(chdummy);
    }
    res.end(JSON.stringify(chdummy_ret_arr));
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
        var chdummy = {};         //object of checkin complete type
        var chdummy_ret_arr = [];     //array of checkin complete objects to be returned to the frontend.
        ch.state = CHECKIN_STATE_CANCELLED;

        //updating the checkin
        ch.save(function(err) {
          if(err) console.log(err);
        });
        chdummy._id = ch._id;
        chdummy.state = ch.state;
        chdummy.pin = ch.pin;
        chdummy.date_created = ch.date_created;
        chdummy.gcm_id = ch.gcm_id;
        chdummy.vendor = Vendor.findOne({_id:ch.vendor},function(err) {
          if(err) console.log(err);
        });
        chdummy.user = User.findOne({_id:ch.user},function(err) {
          if(err) console.log(err);
        });
        chdummy.offer = Offer.findOne({_id:ch.offer},function(err) {
          if(err) console.log(err);
        });

        chdummy_ret_arr.push(chdummy);

      }
      res.end(JSON.stringify(chdummy_ret_arr));
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

      for(var i =0;i<checkins_conf_filter.length;i++) {
        var ch = checkins_conf_filter;
        var chdummy = {};             //object of checkin complete type
        var chdummy_ret_arr = [];     //array of checkin complete objects to be returned to the frontend.
        
        chdummy._id = ch._id;
        chdummy.state = ch.state;
        chdummy.pin = ch.pin;
        chdummy.date_created = ch.date_created;
        chdummy.gcm_id = ch.gcm_id;
        chdummy.vendor = Vendor.findOnex({_id:ch.vendor},function(err) {
          if(err) console.log(err);
        });
        chdummy.user = User.findOne({_id:ch.user},function(err) {
          if(err) console.log(err);
        });
        chdummy.offer = Offer.findOne({_id:ch.offer},function(err) {
          if(err) console.log(err);
        });

        chdummy_ret_arr.push(chdummy);

      }
      res.end(JSON.stringify(chdummy_ret_arr));
    });

  }else{
    error.err(res,"909");
  }
});

module.exports = router;
