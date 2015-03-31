var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var settings=require('./settings');

router.get('/sidebar',function(req,res){
	res.send(JSON.stringify({url:settings.sidebar.url[0]}));
});
router.get('/homepage',function(req,res){
	res.send(JSON.stringify({url:settings.homepage.url[0]}));
});
module.exports=router;
