var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();

var db=mongoose.connection;
/*db.open('mongodb://localhost/test',function (err){
	console.log(err);
});
*/
var Vendor=mongoose.model('Vendor',{
	vendorid : Number ,
	location : {type:[Number],index:'2dsphere'} ,
	offers : [Number]
});


router.get('/create', function (req, res) {
	var vendorid,lat,lon;
	if(req.query.vendorid) vendorid=req.query.vendorid;
	if(req.query.lat) lat=req.query.lat;
	if(req.query.lon) lon=req.query.lon;
  	res.send('create request recieved for '+vendorid +' '+lat+' '+lon);
  	var vendor=new Vendor({
		vendorid:vendorid,
		location:[lat,lon]
	});
	vendor.save(function (err){
		if(err) console.log(err);
	})
});

router.get('/get', function (req,res){
	var vendorid;
	if(req.query.vendorid) vendorid=req.query.vendorid;
	Vendor.findOne({vendorid:vendorid},function (err,data){
		if(err) console.log(err);
		if(data) res.send('vendorid : '+data.vendorid +'<br/>location : '+data.location+'</br>offers list : '+data.offers);
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
				res.write('vendorid : '+vendor.vendorid +' location : '+vendor.location+' offers list : ['+vendor.offers+']<br/>');
			}
			res.end();
		}
	});
})
module.exports = router;

