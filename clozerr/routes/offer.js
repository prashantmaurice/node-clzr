var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();


var Offer=mongoose.model('Offer',{
	//offerid: Number
	type:String,
	stamps:String,
	dateCreated:Date,
	caption:String,
	description:String
});

router.get('/get', function(req, res) {
	var id;
	if(req.query.id) id=req.query.id;

  	Offer.findOne({_id:id},function (err,data){
		if(err) console.log(err);
		if(data) res.send('offer:_id : '+data._id );
		else res.end();
	})
});

router.get('/create', function(req, res) {
	var type,stamps,dateCreated,caption,description;
	//if(req.query.offerid) offerid=req.query.offerid;
	if(req.query.type) type = req.query.type;
	if(req.query.stamps) stamps = req.query.stamps;
	if(req.query.dateCreated) dateCreated = req.query.dateCreated;
	if(req.query.caption) caption = req.query.caption;
	if(req.query.description) description = req.query.description;
	
  	var offer=new Offer({type:type,stamps:stamps,dateCreated:dateCreated,caption:caption,description:description});
  	res.send('create request recieved for '+JSON.stringify(offer));
  	offer.save(function (err){
  		if(err) console.log(err);
  	})
});

module.exports = router;
