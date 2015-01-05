var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Promise = mongoose.Promise;
var Q = require("q");
var OfferHandler = require("./predicate");
var error = require("./error");
var s3 = require("s3policy");
var policy = require("s3-policy");
var settings = require("./settings");

router.get('/create', function (req, res) {

    var errobj = error.err_insuff_params(res, req.query, ["latitude", "longitude", "image", "fid", "name"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var lat = req.query.latitude;
    var lon = req.query.longitude;
    var image = req.query.image;
    var fid = req.query.fid;
    var name = req.query.name;
    var offers = [],
        offers_old = [],
        date_created = new Date();

    var vendor = new Vendor({
        //vendorid:vendorid,
        location: [lat, lon],
        name: name,
        offers: offers,
        image: image,
        offers_old: offers_old,
        fid: fid,
        date_created: date_created
    });

    res.send({
        result: true,
        vendor: vendor
    });

    vendor.save();
});

router.get('/get/all',function(req,res) {

    Vendor.find({},function(err,data) {
        if(err) {
            console.log(err);
            return;
        }
        res.send(JSON.stringify(data));
    });
});

router.get('/get', function (req, res) {

    var errobj = error.err_insuff_params(res, req, ["vendor_id"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var id = req.query.vendor_id;

    Vendor.findOne({
        _id: id
    }, function (err, vendor) {
        if (err) console.log(err);
        if (!vendor) {
            // TODO: Throw error.
        }

        Offer.find({
            _id: {
                $in: vendor.offers
            }
        }, function (err, offers) {
            var vendor_json = vendor.toJSON();
            vendor_json.offers = offers;
            //debugger;
            res.send(JSON.stringify(vendor_json));
            res.end();
        });

    });
})

router.get('/addoffer', function (req, res) {

    var errobj = error.err_insuff_params(res, req.query, ["vendor_id", "offer_id"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var vendorid = req.query.vendor_id;
    var offerid = req.query.offer_id;

    Vendor.update({
        _id: vendorid
    }, {
        $addToSet: {
            offers: offerid
        }
    }, function (err, num, raw) {
        debugger;
        if (err) console.log(err + ' num : ' + num + ' raw : ' + raw);
        else {
            res.send({
                result: true
            });
        }
    })
});

router.get('/upload-policy', function( req, res ){
		/*
			TODO: Only allow if the user is linked to this vendor.
		*/
		/*
			TODO: Check input parameters for id & access_token.
		*/

		var p = policy({
			secret: settings.s3.secret_key,
			length: 5000000,
			bucket: settings.s3.bucket,
			key: settings.s3.base_path + "/" + req.user.username,
			expires: new Date(Date.now() + 60000),
			acl: 'public-read'
		});

		//var myS3Account = new s3( settings.s3.access_key, settings.s3.secret_key );
		//var policy = myS3Account.writePolicy( settings.s3.base_path + "/" + req.user.username, settings.s3.bucket, 60, 10, 'public-read', function( a ){
		//	console.log( a );
		//});
		res.end( JSON.stringify({ result:true, data:p }) );

});

router.get('/get/visited', function( req, res ){
	var user =  req.user;
	var fid_list =_.keys( user.stamplist );
	console.log(fid_list);
	Vendor.find( { fid : { $in : fid_list } }, function( err, vendors ){
		res.end( JSON.stringify({ result:true, data:vendors }) );
	});
});

router.get("/request", function( req, res ){
	var user = req.user;

});

router.get('/get/near', function (req, res) {

    var errobj = error.err_insuff_params(res, req, ["latitude", "longitude", "type"]);

    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var lat = req.query.latitude;
    var lon = req.query.longitude;
    var distance = req.query.distance;
    var access_token = req.query.access_token;
    var typelist = JSON.parse(req.query.type);
		console.log( typelist );
    Vendor.find({
        location: {
            $near: [lat, lon]
        }
    }, function (err, vendors) {
        if (err) {
            console.log(err);
        }
        //console.log( vendors );
        var vendor_det_ret_arr = [];
        var plist = [];
        for (var i = 0; i < vendors.length; i++) {
            var vendor = vendors[i];
            console.log("Getting offers: ");
            console.log(vendor.offers);
            var pr = Offer.find({
                _id: {
                    $in: vendor.offers
                },
								type:{
									$in: typelist
								}
            }).exec();
            //debugger;
            plist.push(
							pr.then(
								(function( vendor ){
							return function (offers) {
                var deferred = Q.defer();
								debugger;
                var offers_new = _.filter(offers, function (offer) {
                    return OfferHandler.qualify(req.user, vendor, offer);
                });
                //debugger;
                var vendor_new = {};
                vendor_new.location = vendor.location;
                vendor_new.name = vendor.name;
                vendor_new.offers = offers_new;
                vendor_new.image = vendor.image;
                vendor_new.fid = vendor.fid;
                vendor_new._id = vendor._id;
								console.log( vendor_new );
                vendor_det_ret_arr.push(vendor_new);
                //debugger;
                process.nextTick(function () {
                    console.log("resolving.");
                    deferred.resolve();
                });
                return deferred.promise;
            };
						})( vendors[i] )
						));

        }
        //debugger;
        Q.all(plist).then(function () {
            //debugger;
            res.send(JSON.stringify(vendor_det_ret_arr));
            res.end();
        });

    });
})
module.exports = router;
