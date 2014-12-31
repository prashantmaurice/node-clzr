var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();


var Offer=mongoose.model('Offer',{
	offerid: Number
});

router.get('/get', function(req, res) {
	var offerid;
	if(req.query.offerid) offerid=req.query.offerid;
  	Offer.findOne({offerid:offerid},function (err,data){
		if(err) console.log(err);
		if(data) res.send('offerid : '+data.offerid );
		else res.end();
	})
});

router.get('/create', function(req, res) {
	var offerid,usertoken;
	if(req.query.offerid) offerid=req.query.offerid;
  	var offer=new Offer({offerid:offerid});
  	res.send('create request recieved for '+offerid);
  	offer.save(function (err){
  		if(err) console.log(err);
  	})
});

module.exports = router;
