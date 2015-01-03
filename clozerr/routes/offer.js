var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var Schema =mongoose.Schema;
var models = require('./models');
var Offer = models.Offer;

router.get('/get', function(req, res) {
	
	var errobj = error.err_insuff_params(req.query,["offer_id"]);
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
	
	var errobj = error.err_insuff_params(req.query,["type","caption","description"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
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
var id,type,stamps,dateCreated,caption,description;
if(req.query.id)id=req.query.id;
else {error.err(res,"102");return;}
if(req.query.type) type = req.query.type;
if(req.query.stamps) stamps = req.query.stamps;
dateUpdated = new Date();
if(req.query.caption) caption = req.query.caption;
if(req.query.description) description = req.query.description;
Offer.findOne({_id:id},function (err,data){
		if(err) console.log(err);
		if(data) {
			var off=data;
			Offer.update({_id:off.id}, {$set: { type:type,stamps:stamps,dateUpdated:dateUpdated,caption:caption,description:description }}, {upsert: true}, function(err){
				error.err(res:"102");
			})
		}
		else res.end();
	})
})

router.get('/delete', function(req,res) {

	var errobj = error.err_insuff_params(req.query,["offer_id"]);
	if(errobj) {
		error.err(res,errobj.code,errobj.params);
		return;
	}

	Vendor.findOne({_id:offer_id},function(err, vendor) {
		if(err)	console.log(err);

	})
});

module.exports = router;
