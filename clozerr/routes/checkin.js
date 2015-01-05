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

var app = express();
//var http = require('http').Server(app);


var Vendor = models.Vendor;
var Offer = models.Offer;
var CheckIn = models.CheckIn;
var User = models.User;

var OfferHandler = require("./predicate");



var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;

router.get("/create", function (req, res) {
    /*
    TODO: CHECK FOR req.query parameters.
    Throw error if insufficient parameters.
    */

    var errobj = error.err_insuff_params(res, req, ["vendor_id", "offer_id"]); //,"gcm_id"]);
if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    //TODO : Check for duplicates and handle that

    var user = req.user;
    var gcm_id = req.query.gcm_id || 0;

    var obj = {
        user: req.user
    };
    Vendor.findOne({
        _id: req.query.vendor_id
    }).exec().then(function (vendor) {
        debugger;
        obj.vendor = vendor;
        return Offer.findOne({
            _id: req.query.offer_id
        }).exec();

    }).then(function (offer) {
        /*
      TODO: Check if offer_id is there in the vendor's current offers.
      */
      if (!offer) {
            // error.
        }
        obj.offer = offer;
        debugger;
        if (!OfferHandler.qualify(obj.user, obj.vendor, obj.offer)) {
            // TODO: change error description.
            error.err(res, "568");
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
            console.log("Successfully saved checkin");
        });

        res.end(JSON.stringify({
            result: true,
            checkin: checkin
        }));
        /*
      TODO: Send alert to Vendor. SocketIO.
      */
      
      global.io.emit('signal', JSON.stringify({vendor_id:obj.vendor._id}) );

  });

});

function sendPushNotification(checkinobj) {
    var message = new gcm.Message({
        collapseKey: 'Stamps updated !',
        delayWhileIdle: true,
        data: {
            "key": "checkin_push",
            "checkinobj": checkinobj
        }
    });

    var sender = new gcm.Sender('key'); //Insert Google Server API Key
    var regIds = [];
    regIds.push(checkinobj.gcm_id); //Insert Registration ID

    sender.send(message, regIds, 4, function (err, res) {
        console.log(res);
        if (err) console.log(err);
    });
}

router.get("/validate", function (req, res) {

    if (!(req.user.type == "vendor")) {
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
                //debugger;
                OfferHandler.onCheckin(obj.user, obj.vendor, obj.offer);
                //debugger;
                obj.user.save();

                res.end(JSON.stringify({
                    result: true
                }));
            });

        } else error.err(res, "435");
    }, function (err) {
        // throw.
        console.log(err);
    });

});

function check_expiry(checkin) {
    if ( (new Date()).getTime() - (checkin.date_created).getTime() < 1000000 ) return true;
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


router.get("/active", function ( req, res ) {
    var user = req.user;
    var userobj = user;
    var ut = userobj.type;
    var chdummy_ret_arr = [];

    if (ut == "user") {
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
    res.end(JSON.stringify( { result:true, data:chdummy_ret_arr } ));
});

});
} else if (ut == "vendor") {
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
            var len = checkins_filter_exp_arr[1].length;
            var plist = [];

            _.each( checkins_list, function( ch, index, array ){
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
                    chfull.state = CHECKIN_STATE_CANCELLED;
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
                res.end(JSON.stringify({ result:true, data:chdummy_ret_arr }));
            });
        });

}
});



router.get("/confirmed", function (req, res) {
    var user = req.user;
    var userobj = User.findOne({
        _id: user
    });
    var ut = userobj.type;

    if (ut=="vendor") {

        CheckIn.find({
            vendor: userobj.vendor_id
        }, function (err, checkins_list) {
            if (err) console.log(err);
            var checkins_list = _.filter(checkins_list, function (checkin) {
                return check_confirmed(checkin);
            });
            console.log(checkins_list);
            var len = checkins_list.length;
            var plist = [];
            _.each( checkins_filter_exp_arr[1], function( ch, index, arr ){
                //var ch = checkins_filter_exp_arr[1][i];

                var chfull = {};

                var pr = Vendor.findOne({
                    _id: ch.vendor
                }).exec().then(function (vendor) {

                  //debugger;
                    chfull.vendor = vendor.toJSON();
                    return User.findOne({
                        _id: ch.user
                    }).exec();

                }).then(function (user) {

                  //debugger;
                    chfull.user = user.toJSON();
                    return Offer.findOne({
                        _id: ch.offer
                    }).exec();

                }).then(function (offer) {
                    var deferred = Q.defer();
                    //debugger;
                    chfull.offer = offer.toJSON();
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
                res.end(JSON.stringify(chdummy_ret_arr));
            });

        });
}
else {
    error.err(res, "909");
}
});



    router.get("/confirmed", function (req, res) {
        var user = req.user;
        var userobj = User.findOne({
            _id: user
        });
        var ut = userobj.type;

        if (ut=="vendor") {

            CheckIn.find({
                vendor: userobj.vendor_id
            }, function (err, checkins_list) {
                if (err) console.log(err);
                var checkins_list = _.filter(checkins_list, function (checkin) {
                    return check_confirmed(checkin);
                });
                console.log(checkins_list);
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
                        })
                    }).then(function (user) {
                        chfull.user = user;
                        return Offer.findOne({
                            _id: ch.offer
                        })
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
                    res.end(JSON.stringify(chdummy_ret_arr));
                });
            });
        }
        else {
            error.err(res, "909");
        }
    });

    module.exports = router;


