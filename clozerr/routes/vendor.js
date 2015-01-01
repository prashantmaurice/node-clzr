var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();

var Vendor=mongoose.model('Vendor',{
	//vendorid : Number ,
	location : {type:[Number],index:'2dsphere'} ,
	offers : [String],
	image : String,
	offers_old : [String],
	fid:String,
	dateCreated:Date
});


router.get('/create', function (req, res) {
	var lat,lon,offers=[],image,offers_old=[],fid,dateCreated=new Date();
	//if(req.query.vendorid) vendorid=req.query.vendorid;
	if(req.query.lat) lat=req.query.lat;
	if(req.query.lon) lon=req.query.lon;
	if(req.query.image) image=req.query.image;
	if(req.query.fid) fid=req.query.fid;

  
  	var vendor=new Vendor({
		//vendorid:vendorid,
		location:[lat,lon],
		offers:offers,
		image:image,
		offers_old:offers_old,
		fid:fid,
		dateCreated:dateCreated
	});
	res.send('create request received : <br>'+JSON.stringify(vendor));
	vendor.save(function (err){
		if(err) console.log(err);
	})
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

router.get('/getnear',function (req,res){
	var lat,lon,distance;
	if(req.query.lat) lat=req.query.lat;
	if(req.query.lon) lon=req.query.lon;
	if(req.query.distance) distance=req.query.distance;
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
				res.write(JSON.stringify(vendor);
			}
			res.end();
		}
	});
})
module.exports = router;

