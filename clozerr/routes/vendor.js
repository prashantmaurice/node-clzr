var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Q = require("q");


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
	Vendor.findOne({_id:id},function (err,data){
		if(err) console.log(err);
		if(data) res.send(JSON.stringify(data));
		else res.end();
	})
})

router.get('/addoffer',function (req,res){
	var offerid,vendorid;
	if(req.query.vendorid) vendorid=req.query.vendorid;
	if(req.query.offerid) offerid=req.query.offerid;


	Vendor.update({_id:vendorid},{$addToSet:{offers:offerid}},function (err,num,raw){
		debugger;
		if(err) console.log(err+ ' num : '+num+' raw : '+raw);
		else {
			res.send('added to '+num+' records');
		}
	})
})

function getUser( req, cb ){
	Token.findOne({
					accesstoken:req.query.accesstoken
				},function(err,data){
					if(err) console.log(err);	//No predefined accesstoken for that user
					else{
						user.findOne({
							fb_id:data.accountid
						},cb);
					}
				});
}



/*function filterOffers( offers, criteria, checkstamps ){

	var len=vendor.offers.length;
	for(var i=0;i<len;i++) {
		Offer.findOne({
		_id:vendor.offers[i]
		},checkstamps );
	}

}*/

var predicates = {
    "S1": function( user, vendor, offer ){
    	if(user.stamplist[vendor.fid]>=0)	return true;
    	else return false;
     },
    "S0": function( user, vendor, offer ){
    	return true;
    	},
    "SX": function( user, vendor, offer ){
    	var temp = offer.type.split('');
     	if(user.stamplist[vendor.fid]>=parseInt(temp[1]))	return true;
     	else return false;
     }
}

function checkConditions( user, vendor, offer ){
    return predicates[offer.type]( user, vendor, offer );
}

function getOffers( offer_ids ){
    return Offer.find({"_id":{ "$in":offer_ids }} ).exec();
}

router.get('/getnear',function (req,res){
	var lat,lon,distance,access_token,typelist;
	//var vendor_det_ret_arr = [];
	if(req.query.latitude) lat=req.query.latitude;
	if(req.query.longitude) lon=req.query.longitude;
	if(req.query.distance) distance = req.query.distance;
	if(req.query.access_token) access_token = req.query.access_token;
	if(req.query.type) typelist = JSON.parse(type);

		var user = req.user;
	    Vendor.find(
            {
		        location: {
                    $near :[lat, lon]
                }
	        },function ( err, vendors ){
								if( err ){
									console.log(err);
								}
								console.log( vendors );
                var vendor_det_ret_arr = [];
                var plist = [];
			    for(var i=0;i<vendors.length;i++){
				    var vendor = vendors[i];

                    plist.push( getOffers( vendor.offers, function( err, offers ){

                        var offers_new = _.filter( offers, function( offer ){
                            return checkConditions( user, vendor, offer );
                        });
                        /*
                         * MAKE VENDOR HERE.
                         */
                        var vendor_new;
                        vendor_new.location = vendor.location;
                        vendor_new.name = vendor.name;
                        vendor_new.offers = offers_new;
                        vendor_new.image = vendor.image;
                        vendor_new.fid = vendor.fid;
                        vendor_det_ret_arr.push( vendor_new );
                    }) );
                }

                Q.all( plist ).then( function(){
        			res.send(JSON.stringify(vendor_det_ret_arr));
		        	res.end();
                });

		    });
})
module.exports = router;
