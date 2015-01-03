var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var Schema =mongoose.Schema;
var models = require('./models');
var Offer = models.Offer;
var Vendor = models.Vendor;
var error = require("./error");
var _ = require('underscore');
;
router.get('/get', function(req, res) {
	
	var errobj = error.err_insuff_params(res,req,["offer_id"]);
	if(!errobj) {
		//error.err(res,errobj.code,errobj.params);
		return;
	}

	var id = req.query.offer_id;

  	Offer.findOne({_id:id},function (err,data){
		if(err) console.log(err);
		if(data) {
			res.send('offer:_id : '+data._id );
			res.end();
		}
		else {
			error.err(res,"210");
			res.end();
		}
	})
});

router.get('/create', function(req, res) {
	
	var errobj = error.err_insuff_params(res,req,["type","caption","description"]);
	if(!errobj) {
		//error.err(res,errobj.code,errobj.params);
		return;
	}

	var type = req.query.type;
	if(req.query.stamps) stamps = req.query.stamps;
	else stamps =1;
    dateCreated = new Date();
	if(req.query.caption) caption = req.query.caption;
	if(req.query.description) description = req.query.description;
   	var offer=new Offer({type:type,stamps:stamps,dateCreated:dateCreated,caption:caption,description:description,dateUpdated:dateCreated});

	var dateCreated = new Date();
	var caption = req.query.caption;
	var description = req.query.description;

  	var offer=new Offer({type:type,stamps:stamps,dateCreated:dateCreated,caption:caption,description:description});
  	res.send('create request recieved for '+JSON.stringify(offer));
  	offer.save(function (err){
  		if(err) console.log(err);
  	})
});
router.get('/update',function(req,res){
var type,stamps,dateCreated,caption,description;

var errobj = error.err_insuff_params(res,req,["offer_id"]);
if(!errobj) {
		//error.err(res,errobj.code,errobj.params);
		return;
	}

var id=req.query.offer_id;
var offer = Offer.findOne({_id:id},function(err,data) {
	if(err)
		error.err(res,"210");
});

if(req.query.type) {
	type = req.query.type;
}
else type = offer.type;
if(req.query.stamps) {
	stamps = req.query.stamps;
}
else stamps = offer.stamps;
dateUpdated = new Date();
if(req.query.caption) {
	caption = req.query.caption;
}
else caption = offer.caption;
if(req.query.description) {
	description = req.query.description;
}
else description = offer.description;

var date_created = offer.date_created;

Offer.findOne({_id:id},function (err,data){
		if(err) console.log(err);
		if(data) {
			var off=data;
			/*Offer.update({_id:off.id}, {$set: { type:type,stamps:stamps,caption:caption,description:description }}, {upsert: true}, function(err){
				if(err)	error.err(res,"102");
			})*/
			var offer_temp = new Offer({_id:id,type:type,stamps:stamps,caption:caption,description:description,date_created:date_created});
			/*offer_temp.save(function(err) {
				if(err)	console.log(err);
			});*/
			Offer.update({_id:id},offer_temp);
		}
		res.end();
	})
});

router.get('/delete', function(req,res) {

	var errobj = error.err_insuff_params(res,req,["offer_id","vendor_id"]);
	if(!errobj) {
		//error.err(res,errobj.code,errobj.params);
		return;
	}

	var offer_id = req.query.offer_id;
	var vendor_id = req.query.vendor_id;

	Vendor.findOne({_id:vendor_id},function(err,vendor) {
		if(err)	console.log(err);
		res.send(JSON.stringify(vendor));
		vendor.offers_old.push(offer_id);
		var arr_offers = vendor.offers;
		var index = arr_offers.indexOf(offer_id);

		if(index > -1) {
			arr_offers.splice(index,1);
		}
		vendor.offers = arr_offers;
		//TODO : update vendors
		//vendor.save();
		res.send(JSON.stringify(vendor));

	});
});

module.exports = router;
