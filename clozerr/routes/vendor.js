var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Vendor = models.Vendor;
var Offer = models.Offer;
var VendorRequest = models.VendorRequest;
var Promise = mongoose.Promise;
var Q = require("q");
var OfferHandler = require("./predicate");
var error = require("./error");
var s3 = require("s3policy");
var policy = require("s3-policy");
var settings = require("./settings");

router.get('/create', function (req, res) {

    var errobj = error.err_insuff_params(res, req, ["latitude", "longitude", "image", "fid", "name"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }
    if(req.query.user="admin"){
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
        date_created: date_created,
        dateUpdated:date_created
    });

    res.send({
        result: true,
        data: vendor
    });

    vendor.save();
}
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
        if ( !vendor ) {
            error.err( res, "845" );
						return;
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

	// TODO: Only admin allowed.
    var errobj = error.err_insuff_params(res, req, ["vendor_id", "offer_id"]);
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
                result: true,
								data:raw
            });
        }
    })
});

router.get('/upload-policy', function( req, res ){
		/*
			TODO: Only allow if the user is linked to this vendor.
		*/

        var errobj = error.err_insuff_params(res,req,["id","access_token"]);
        if(!errobj) {
            return;
        }

		var p = policy({
			secret: settings.s3.secret_key,
			length: 5000000,
			bucket: settings.s3.bucket,
			key: settings.s3.base_path + "/" + req.user.username,
			expires: new Date(Date.now() + 60000),
			acl: 'public-read'
		});

		res.end( JSON.stringify({ result:true, data:p }) );

});

function attachStamps( user, vendors ){
	return _.map( vendors, function( vendor ){
		var new_vendor = vendor.toJSON();
		new_vendor.stamps = user.stamplist[new_vendor.fid] || 0;
		return new_vendor;
	});
}

router.get('/get/visited', function( req, res ){

	var user =  req.user;
	var fid_list =_.keys( user.stamplist );
	console.log(fid_list);
	Vendor.find( { fid : { $in : fid_list } }, function( err, vendors ){
		if( err ){
			//TODO: Put error.
		}
		res.end( JSON.stringify({ result:true, data:attachStamps( user, vendors ) }) );
	});

});

router.get("/request", function( req, res ){
	var user = req.user;
	var request = new VendorRequest( {account:user._id, name:req.query.name, remarks:req.query.remarks } );
	request.save();
	res.end(JSON.stringify( {result:true} ) ) ;
});

router.get('/get/near', function (req, res) {

    var errobj = error.err_insuff_params(res, req, ["latitude", "longitude"]);

    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

		var type = req.query.type;

		if( !type )
			type = JSON.stringify(["S0","S1","SX"]);

		var limit = req.query.limit;

		if( !limit )
			limit = 6;

		var offset = req.query.offset;

		if( !offset )
			offset = 0;

    var lat = req.query.latitude;
    var lon = req.query.longitude;
    var distance = req.query.distance;
    var access_token = req.query.access_token;
    var typelist = JSON.parse( type );

		console.log( typelist );
    Vendor.find({
        location: {
            $near: [lat, lon]
        },
        visible:true
    }).limit( limit ).skip( offset ).exec().then(function (vendors) {

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
								(function( vendor, index ){
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
                vendor_det_ret_arr[index] = (vendor_new);
                //debugger;
                process.nextTick(function () {
                    console.log("resolving.");
                    deferred.resolve();
                });
                return deferred.promise;
            };
					})( vendors[i], i )
						));

        }
        //debugger;
        Q.all(plist).then(function () {
            debugger;
						//console.log("RESOLVED.");
            res.send(JSON.stringify(vendor_det_ret_arr));
            res.end();
        });

    });
})
router.get('/update', function (req, res) {
    var latitude, longitude, image, fid, name, visible, address, city, phone, description;
    var user=req.user;
    var errobj = error.err_insuff_params(res, req, ["vendor_id"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var id = req.query.vendor_id;
    var vendor = Vendor.findOne({
        _id: id
    }, function (err, data) {
        if (err) error.err(res, "210");
        return;
    });
if(user.type="admin"){
    if (req.query.latitude) {
        latitude = req.query.latitude;
    } else latitude = vendor.latitude;
    //debugger;
    if (req.query.longitude) {
        longitude = req.query.longitude;
    } else longitude = vendor.latitude;

    dateUpdated = new Date();
    if (req.query.image) {
        image = req.query.image;
    } else image = vendor.image;

    if (req.query.fid) {
        fid = req.query.fid;
    } else fid = vendor.fid;

    if(req.query.vendor_name){
        name=req.query.vendor_name;
    }else name=vendor.name;

		if(req.query.phone){
			phone=req.query.phone;
		}else phone = vendor.phone;

		if(req.query.address){
			address = req.query.address;
		}else address=vendor.address;

		if(req.query.city){
			name=req.query.city;
		}else city=vendor.city;

		if( req.query.visible ){
			visible = (req.query.visible == "true");
		}else visible = vendor.visible;

		if( req.query.description ){
			description = req.query.description;
		}else description = vendor.description;


    var date_created = vendor.date_created;

    Vendor.findOne({
        _id: id
    }, function (err, vendor) {
        if (err) console.log(err);
        if (vendor) {

            vendor.location = [latitude, longitude];
            vendor.image = image;
            vendor.fid = fid;
            vendor.date_created = date_created;
            vendor.dateUpdated = new Date();
            vendor.name=name;
						vendor.visible = visible;
						vendor.city = city;
						vendor.address = address;
						vendor.phone = phone;
						vendor.description = description;
            vendor.save(function (err) {
                if (err) console.log(err);
            });
            res.send(JSON.stringify({result:true}));
        }
        else {
            //Throw error - no such offer
            error.err(res,"210");
						return;

        }

        res.end();
    });
}
});
module.exports = router;
