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
	var lat,lon,offers=[],image,offers_old=[],fid,date_created=new Date(),name;
	//if(req.query.vendorid) vendorid=req.query.vendorid;
	if(req.query.latitude) lat=req.query.latitude;
	if(req.query.longitude) lon=req.query.longitude;
	if(req.query.image) image=req.query.image;
	if(req.query.fid) fid=req.query.fid;
	if(req.query.name) name=req.query.name;


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
	res.send('create request received : <br>'+JSON.stringify(vendor));

	/*vendor.save(function (err){
		if(err) console.log(err);
	});*/
vendor.save();
});

router.get('/get', function (req,res){
	var id;
	if(req.query.id) id=req.query.id;
	else{
		// TODO: THROW ERROR.
		return;
	}

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
	var offerid,vendorid;
	if(req.query.vendorid) vendorid=req.query.vendorid;
	if(req.query.offerid) offerid=req.query.offerid;


	Vendor.update({_id:vendorid},{$addToSet:{offers:offerid}},function (err,num,raw){
		debugger;
		if(err) console.log(err+ ' num : '+num+' raw : '+raw);
		else {
			res.send({ result : true });
		}
	})
});



/*function filterOffers( offers, criteria, checkstamps ){

	var len=vendor.offers.length;
	for(var i=0;i<len;i++) {
		Offer.findOne({
		_id:vendor.offers[i]
		},checkstamps );
	}

}*/


router.get('/getnear',function (req,res){
	var lat,lon,distance,access_token,typelist;
	//var vendor_det_ret_arr = [];
	if(req.query.latitude) lat=req.query.latitude;
	if(req.query.longitude) lon=req.query.longitude;
	if(req.query.distance) distance = req.query.distance;
	if(req.query.access_token) access_token = req.query.access_token;
	if(req.query.type) typelist = JSON.parse(type);



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
