var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var Schema =mongoose.Schema;
var Vendor=mongoose.model('Vendor',new Schema({
	//vendorid : Number ,
	location : {type:[Number],index:'2dsphere'} ,
	name:String,
	offers : [String],
	image : String,
	offers_old : [String],
	fid:String,
	dateCreated:Date
}));

var vendor_det_ret={};


router.get('/create', function (req, res) {
	var lat,lon,offers=[],image,offers_old=[],fid,dateCreated=new Date(),name;
	//if(req.query.vendorid) vendorid=req.query.vendorid;
	if(req.query.lat) lat=req.query.lat;
	if(req.query.lon) lon=req.query.lon;
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
		dateCreated:dateCreated
	});
	res.send('create request received : <br>'+JSON.stringify(vendor));
	vendor.save(function (err){
		if(err) console.log(err);
	});
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
	Vendor.update({vendorid:vendorid},{$addToSet:{offers:offerid}},function (err,num,raw){
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

function iterateThroughOffers(user,vendor,checkstamps){
	
	var len=vendor.offers.length;
	for(var i=0;i<len;i++) {
		Offer.findOne({
		_id:vendor.offers[i]
		},checkstamps);
	}
	
}

router.get('/getnear',function (req,res){
	var lat,lon,distance,accesstoken,typelist;
	var vendor_det_ret_arr = [];
	if(req.query.lat) lat=req.query.lat;
	if(req.query.lon) lon=req.query.lon;
	if(req.query.distance) distance=req.query.distance;
	if(req.query.accesstoken) accesstoken=req.query.accesstoken;
	if(req.query.type) typelist=JSON.parse(type);

	Vendor.find({
		location: {$near :{$geometry:{
			type:'Point',
			coordinates:[lat,lon]},
			$maxDistance : distance
		}}
	},function (err,data){
		if(err) console.log(err);
		else{
			for(var i=0;i<data.length;i++){
				var vendor=data[i];
				getUser( req, function( err, data ){ 
					if(data.stamplist[vendor.fid]!=null) {
						iterateThroughOffers(data,vendor,function(err,data) {
							if(err)	console.log(err);
							else {
								var temptype=data.type;
								if(typelist.contains(data.type)) {
									vendor_det_ret.id=vendor._id;
									vendor_det_ret.name=vendor.name;
									vendor_det_ret.location=vendor.location;
									vendor_det_ret.offer=data;
									vendor_det_ret.image=vendor.image;
									vendor_det_ret.fid=vendor.fid;
									vendor_det_ret_arr.push(vendor_det_ret);
								}
							}
						});
					}
				});
			}
			res.send(JSON.stringify(vendor_det_ret_arr));
			res.end();
		}
	});
})
module.exports = router;

