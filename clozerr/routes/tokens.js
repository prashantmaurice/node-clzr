var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();

var Token = mongoose.model('Token',{
	accesstoken:String,
	accountid:String
});

router.get('/create', function(req,res){
	var accesstoken,accountid;
	if(req.query.accesstoken) accesstoken = req.query.accesstoken;
	if(req.query.accountid) accountid = req.query.accountid;

	var token = new Token({accesstoken:accesstoken,accountid:accountid});
	res.send('create request received for : ' + JSON.stringify(token));
	token.save(function (err){
		if(err) console.log(err);
	});
});