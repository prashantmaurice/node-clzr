var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var Schema =mongoose.Schema;
var models = require('./models');
var Offer = models.Offer;

router.get('/get', function(req, res) {
	
	var errobj = err_insff_params(req.query,["offer_id"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}

	var id = req.query.offer_id;

  	Offer.findOne({_id:id},function (err,data){
		if(err) console.log(err);
		if(data) res.send('offer:_id : '+data._id );
		else res.end();
	})
});

router.get('/create', function(req, res) {
	
	var errobj = err_insuff_params(req.query,["type","caption","description"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}

	var type = req.query.type;
	if(req.query.stamps) stamps = req.query.stamps;
	else stamps =1;
	var dateCreated = new Date();
	var caption = req.query.caption;
	var description = req.query.description;

  	var offer=new Offer({type:type,stamps:stamps,dateCreated:dateCreated,caption:caption,description:description});
  	res.send('create request recieved for '+JSON.stringify(offer));
  	offer.save(function (err){
  		if(err) console.log(err);
  	})
});

module.exports = router;
