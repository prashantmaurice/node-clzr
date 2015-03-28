var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Q = require("q");
var error = require("./error");
var hat = require("hat");
var rack = hat.rack(10, 10);
var gcm = require("node-gcm");
var settings = require("./settings");
var push = require("./util/push");


var ReviewScheduler = require("./util/review");

var app = express();
//var http = require('http').Server(app);


var Vendor = models.Vendor;
var Offer = models.Offer;
var CheckIn = models.CheckIn;
var User = models.User;
var Review = models.Review;

var OfferHandler = require("./predicate");

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

function policyCheckTimeDelayBetweenCheckins( user, vendor, offer ) {


  return CheckIn.findOne( { user:user._id, vendor:vendor._id, offer:offer._id } ).exec().then(function( res, checkin ){
    var deferred = Q.defer();

    if( Math.abs( new Date().getTime() - checkin.date_created.getTime() ) < settings.checkin.delay_between_checkins ) {
      process.nextTick( function(){
        deferred.resolve( false );
      });
    }
    else{
      process.nextTick( function(){
        deferred.resolve( true );
      });
    }

    return deferred.promise;

  });

}

function policyCheckDuplicateCheckins( user, vendor, offer ) {


  return CheckIn.findOne( { user:user._id, vendor:vendor._id, offer:offer._id, state:CHECKIN_STATE_ACTIVE} ).exec().then(function( checkin ){
    var deferred = Q.defer();
    debugger;
    if( checkin ) {
      process.nextTick( function(){
        deferred.resolve( checkin );
      });
    }
    else{
      process.nextTick( function(){
        deferred.resolve( );
      });
    }

    return deferred.promise;

  });

}

function policyCheckTimeDelayBetweenCheckins( user, vendor, offer ) {


  return CheckIn.findOne( { user:user._id, vendor:vendor._id, state:CHECKIN_STATE_CONFIRMED} ).sort("date_created").exec().then(function( checkin ){
    var deferred = Q.defer();
    debugger;

    if( !checkin ){
      process.nextTick( function(){
        deferred.resolve( true );
      });
      return deferred.promise;
    }


    if( Math.abs( new Date().getTime() - checkin.date_created.getTime() ) < settings.checkin.delay_between_checkins ) {
      process.nextTick( function(){
        deferred.resolve( false );
      });
    }
    else{
      process.nextTick( function(){
        deferred.resolve( true );
      });
    }

    return deferred.promise;

  });

}

router.get("/create", function (req, res) {


    var errobj = error.err_insuff_params( res, req, ["vendor_id", "offer_id"] ); //,"gcm_id"]);
    if ( !errobj ) {
        return;
    }

    var user = req.user;
    var gcm_id = req.query.gcm_id || 0;

    var obj = {
        user: req.user
    };
    Vendor.findOne({
        _id: req.query.vendor_id
    }).exec().then(function (vendor) {
        debugger;
        if(!vendor) {
            error.err(res,"801");
            return;
        }
        obj.vendor = vendor;
        return Offer.findOne({
            _id: req.query.offer_id
        }).exec();

    }).then(function (offer) {

      if (!offer) {
        error.err(res,"802");
        return;
      }
    obj.offer = offer;

    var d = obj.vendor.offers.indexOf(obj.offer._id);
    if(d==-1) {
        error.err(res,"671");
        return;
    }

    debugger;
    if (!OfferHandler.qualify(obj.user, obj.vendor, obj.offer)) {

        error.err(res, "568");
        return;
    }

    debugger;

    policyCheckDuplicateCheckins( obj.user, obj.vendor, obj.offer ).then( function( result ) {
      console.log("Detecting duplicates");
      if( result ){
        console.log("Duplicate detected:");
        res.end( JSON.stringify({ result:true, checkin:result }) );
        return;
      }

      return policyCheckTimeDelayBetweenCheckins( obj.user, obj.vendor, obj.offer );

    }).then(function( result ){
        console.log("Validating timedelay");
        if( !result ){
          console.log("Time delay not sufficient");
          error.err( res, "100" );
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
            gcm_id: gcm_id
          });
          debugger;

          checkin.save(function (err, res, num) {
            console.log(err);
            console.log("Successfully saved checkin");
          });

          res.end(JSON.stringify({
              result: true,
              checkin: checkin
          }));

});
      global.io.emit('signal', JSON.stringify({vendor_id:obj.vendor._id}) );

  });

});



router.get("/validate", function (req, res) {

    if (!(req.user.type == "Vendor")) {
        //Throw error.
        error.err(res, "909");
        return;
    }

    var userOfVendor = req.user;

    // Global memory to be used by the Promise chain.
    var obj = {
        userOfVendor: userOfVendor
    };

    var errobj = error.err_insuff_params(res, req, ["checkin_id"]);
    if (!errobj) {
        return;
    }
    debugger;
    //var id = req.query.offer_id;
    //var checkin = req.query.checkin_id;
    CheckIn.findOne({
        _id: req.query.checkin_id
    }).exec().then(function (checkin) {
        debugger;
        obj.checkin = checkin;
        return User.findOne({
            _id: checkin.user.toString()
        }).exec();
    }, function (err) {
        // Throw
        console.log(err);
    }).then(function (user) {
        //  if(err) error.err(res,"302");
        //debugger;
        obj.user = user;

        //debugger;
        if (obj.checkin.vendor.toString() == obj.userOfVendor.vendor_id) {
            // Note: preferably send notification after checkin save in order to make sure the checkin's state is up-to-date.
            obj.checkin.state = CHECKIN_STATE_CONFIRMED;

            var validate_data = {};
            if( req.query.validate_data ){
              try{
                validate_data = JSON.parse( req.query.validate_data );
              }catch( e ){

              }
            }
            obj.checkin.validate_data = validate_data;
            obj.checkin.markModified("validate_data");

            if( !( req.query.test == "true" ) )
              obj.checkin.save();

            //Note : There may be a need to modify the parameters to be sent to the notification,
            //depending on what frontend needs.
            //sendPushNotification(obj.checkin);

            Offer.findOne({
                _id: obj.checkin.offer
            }).exec().then(function (offer) {
                obj.offer = offer;
                return Vendor.findOne({
                    _id: obj.checkin.vendor
                }).exec();
            }).then(function (vendor) {
                obj.vendor = vendor;
                if(obj.vendor.settings.stampAmt)
                obj.checkin.validate_data.stamps=obj.checkin.validate_data.billAmt/obj.vendor.settings.stampAmt;
                obj.checkin.markModified("validate_data");
                //debugger;
                OfferHandler.onCheckin( obj.user, obj.vendor, obj.offer, validate_data );
                //debugger;
                if( !( req.query.test == "true" ) )
                  obj.user.save();

                // ACTION: NOTIFY.
                if( obj.checkin.gcm_id != '0' ){
                  // SHOULD BE CREATED BY OFFER TYPE CONTROLLER.
                  debugger;
                  push.sendPushNotification( obj.checkin.gcm_id, { type: "STANDARD", title: "Check-in Successful", message: "Your visit at " + obj.vendor.name + " has been confirmed!" })
                  var chfull = obj.checkin.toJSON();
                  chfull.user = obj.user;
                  chfull.vendor = obj.vendor;
                  chfull.offer = obj.offer;
                  new ReviewScheduler( chfull ).request();
                }

                res.end(JSON.stringify({
                    result: true
                }));
            });

        } else error.err(res, "435");
    }, function (err) {
        console.log(err);
    });

});

function check_expiry(checkin) {
    var time_delta = (new Date()).getTime() - (checkin.date_created).getTime();
    console.log( time_delta );
    if ( time_delta < 1000000 ) return true;
    else return false;
}

function check_activeness(checkin) {
    if (checkin.state == CHECKIN_STATE_ACTIVE) return true;
    else return false;
}

function check_confirmed(checkin) {
    if (checkin.state == CHECKIN_STATE_CONFIRMED) return true;
    else return false;
}

function cancelCheckins( checkins ){

  _.each( checkins, function( checkin, index, array ){
    checkin.state = CHECKIN_STATE_CANCELLED;
    checkin.save();
  });

  return;
}

router.get("/active", function ( req, res ) {   
    var user = req.user;
    var userobj = user;
    var ut = userobj.type;
    var chdummy_ret_arr = [];

    if (ut == "User"||ut=="TestUser") {
        CheckIn.find({
            user: userobj._id,
            state: CHECKIN_STATE_ACTIVE
        }, function (err, checkins_list) {
            if (err) console.log(err);
            /*var checkins_act_filter = _.filter(checkins_list,function(checkin) {
        return check_activeness(checkin);
    });*/ debugger;
console.log( checkins_list );
var len = checkins_list.length;
var plist = [];
for (var i = 0; i < len; i++) {
    var ch = checkins_list[i];
    var chfull = {};

    var pr = Vendor.findOne({
        _id: ch.vendor
    }).exec().then(function (vendor) {
        chfull.vendor = vendor;
        return User.findOne({
            _id: ch.user
        }).exec();
    }).then(function (user) {
        chfull.user = user;
        return Offer.findOne({
            _id: ch.offer
        }).exec();
    }).then(function (offer) {
        var deferred = Q.defer();

        chfull.offer = offer;
        chfull._id = ch._id;
        chfull.state = ch.state;
        chfull.pin = ch.pin;
        chfull.date_created = ch.date_created;
        chfull.gcm_id = ch.gcm_id;
        chdummy_ret_arr.push(chfull);

        process.nextTick(function () {
            deferred.resolve();
        });
        console.log("DUN");
        return deferred.promise;
    });

    plist.push(pr);

}
Q.all(plist).then(function () {
    console.log("ALL DUN");
    chdummy_ret_arr =  _.sortBy(chdummy_ret_arr, function(chdummyobj) {
                    return (-chdummyobj.date_created.getTime());
                });
    res.end(JSON.stringify( { result:true, data:chdummy_ret_arr } ));
});

});
} else if (ut == "Vendor") {
    debugger;
    CheckIn.find({
        vendor: userobj.vendor_id,
        state: CHECKIN_STATE_ACTIVE
    }, function (err, checkins_list) {
        if (err) console.log(err);
        console.log(checkins_list);

            //Getting all the active checkins

            //Partitioning the active checkins -- based on expiry

            var checkins_filter_exp_arr = _.partition(checkins_list, function (checkin) {
                return check_expiry(checkin);
            });
            //checkins_filter_exp_arr[1] -- setting state to cancelled
            console.log(checkins_list);
            var len = checkins_filter_exp_arr[0].length;
            var plist = [];

            cancelCheckins( checkins_filter_exp_arr[1] );

            _.each( checkins_filter_exp_arr[0], function( ch, index, array ){
                //var ch = checkins_list[i];

                var chfull = {};

                var pr = Vendor.findOne({
                    _id: ch.vendor
                }).exec().then(function (vendor) {
                    chfull.vendor = vendor;
                    return User.findOne({
                        _id: ch.user
                    }).exec();
                }).then(function (user) {
                    chfull.user = user;
                    return Offer.findOne({
                        _id: ch.offer
                    }).exec();
                }).then(function (offer) {
                    var deferred = Q.defer();

                    chfull.offer = offer;
                    chfull._id = ch._id;
                    chfull.state = ch.state;
                    chfull.pin = ch.pin;
                    chfull.date_created = ch.date_created;
                    chfull.gcm_id = ch.gcm_id;
                    chdummy_ret_arr.push(chfull);

                    process.nextTick(function () {
                        deferred.resolve();
                    });
                    console.log("DUN");
                    return deferred.promise;
                });

                plist.push(pr);

            });
            Q.all(plist).then(function () {
              console.log("ALL DUN");
              chdummy_ret_arr =  _.sortBy(chdummy_ret_arr, function(chdummyobj) {
                    return (-chdummyobj.date_created.getTime());
                });
              res.end(JSON.stringify({ result:true, data:chdummy_ret_arr }));
            });
});

}else{
  //throw error
  error.err(res,"909");
}
});

router.get("/confirmed", function (req, res) {
    var userobj = req.user;
    var ut = userobj.type;



    if (ut=="Vendor") {

        CheckIn.find({
            vendor: userobj.vendor_id,
            state:CHECKIN_STATE_CONFIRMED
        }, function (err, checkins_list) {
            if (err) console.log(err);
            var checkins_list = _.filter(checkins_list, function (checkin) {
                return check_confirmed( checkin );
            });
            console.log(checkins_list);
            var len = checkins_list.length;
            var plist = [];
            var chdummy_ret_arr = [];
            _.each( checkins_list, function( ch, index, arr ){
                //var ch = checkins_filter_exp_arr[1][i];

                var chfull = {};

                var pr = Vendor.findOne({
                    _id: ch.vendor
                }).exec().then(function (vendor) {


                    debugger;
                    chfull.vendor = vendor.toJSON();
                    return User.findOne({
                        _id: ch.user
                    }).exec();

                }).then(function (user) {

                    debugger;
                    chfull.user = user.toJSON();
                    return Offer.findOne({
                        _id: ch.offer
                    }).exec();

                }).then(function (offer) {
                    chfull.offer = offer.toJSON();

                    debugger;
                    return Review.findOne({
                        checkinid: ch._id
                    }).exec();
                }).then(function (review){
                    debugger;
                    if( review )
                      chfull.review=review.toJSON();
                    var deferred = Q.defer();
                    chfull._id = ch._id;
                    chfull.state = ch.state;
                    chfull.pin = ch.pin;
                    chfull.date_created = ch.date_created;
                    chfull.gcm_id = ch.gcm_id;
                    chdummy_ret_arr.push(chfull);

                    process.nextTick(function () {
                        deferred.resolve();
                    });
                    console.log("DUN");
                    return deferred.promise;
                });

                plist.push(pr);
            });
Q.all(plist).then(function () {
    console.log("ALL DUN");

                //debugger;
                chdummy_ret_arr =  _.sortBy(chdummy_ret_arr, function(chdummyobj) {
                    return (-chdummyobj.date_created.getTime());
                });
                for(var kk=0;kk<chdummy_ret_arr.length;kk++) {
                    console.log(chdummy_ret_arr[kk].date_created);
                }
                res.end(JSON.stringify(chdummy_ret_arr));
            });

});
}
else {
    error.err(res, "909");
}
});
module.exports = router;
