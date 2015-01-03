var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Promise = mongoose.Promise;
var Q = require("q");
var OfferHandler = require("./predicate");
var error = require("./error");

router.get('/create', function (req, res) {

	var errobj = error.error.err_insuff_params(req.query,["latitude","longitude","image","fid","name"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}

	var lat=req.query.latitude;
	var lon=req.query.longitude;
	var image=req.query.image;
	var fid=req.query.fid;
	var name=req.query.name;
	var offers = [], offers_old = [],date_created = new Date();

  	var vendor=new Vendor({
		//vendorid:vendorid,
		location:[lat,lon],
		name:name,
		offers:offers,
		image:image,
		offers_old:offers_old,
		fid:fid,
		date_created:date_created
	});
	
	res.send({ result : true, vendor : vendor });

vendor.save();
});

router.get('/get', function (req,res){
	
	var errobj = error.error.err_insuff_params(req.query,["id"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}

	var id = req.query.id;

	Vendor.findOne({ _id : id },function ( err, vendor ){
		if(err) console.log( err );
		if( !vendor ){
			// TODO: Throw error.
		}

		Offer.find({ _id : { $in : vendor.offers } }, function( err, offers ){
			var vendor_json = vendor.toJSON();
			vendor_json.offers = offers;
			//debugger;
			res.send(JSON.stringify( vendor_json ));
			res.end();
		});

	});
})

router.get('/addoffer',function (req,res){
	
	var errobj = error.err_insuff_params(req.query,["vendor_id","offer_id"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}

	var vendorid=req.query.vendor_id;
	var offerid=req.query.offer_id;

	Vendor.update({_id:vendorid},{$addToSet:{offers:offerid}},function (err,num,raw){
		debugger;
		if(err) console.log(err+ ' num : '+num+' raw : '+raw);
		else {
			res.send({ result : true });
		}
	})
});


router.get('/get/near',function (req,res){
	
	var errobj = error.err_insuff_params(req.query,["latitude","longitude","access_token","type"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}
	
	var lat = req.query.latitude;
	var lon = req.query.longitude;
	var distance = req.query.distance;
	var access_token = req.query.access_token;
	var typelist = JSON.parse(type);

	    Vendor.find(
            {
		        location: {
                    $near :[lat, lon]
                }
	        },function ( err, vendors ){
								if( err ){
									console.log(err);
								}
								//console.log( vendors );
                var vendor_det_ret_arr = [];
                var plist = [];
			    		for(var i=0;i<vendors.length;i++){
				    				var vendor = vendors[i];
										console.log("Getting offers: ");
										console.log( vendor.offers );
										var pr = Offer.find( { _id:{ $in : vendor.offers }} ).exec();
										//debugger;
                    plist.push( pr.then( function( offers ){
												var deferred = Q.defer();

                        var offers_new = _.filter( offers, function( offer ){
                        	return OfferHandler.qualify( req.user, vendor, offer );
                        });
												//debugger;
                        var vendor_new = {};
                        vendor_new.location = vendor.location;
                        vendor_new.name = vendor.name;
                        vendor_new.offers = offers_new;
                        vendor_new.image = vendor.image;
                        vendor_new.fid = vendor.fid;
												vendor_new._id = vendor._id;
                        vendor_det_ret_arr.push( vendor_new );
												//debugger;
												process.nextTick( function(){
													console.log("resolving.");
													deferred.resolve();
												});
												return deferred.promise;
                    }, function( err ){
												/*
													TODO: SMASH ERROR IN THY FACE.
												*/
										})
										);
                }
								//debugger;
                Q.all( plist ).then( function(){
									//debugger;
        					res.send(JSON.stringify(vendor_det_ret_arr));
		        			res.end();
                });

		    });
})
module.exports = router;
