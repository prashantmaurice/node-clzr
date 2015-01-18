var express = require('express');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var error = require("./error");
var Content = models.Content;

router.get('/', function (req, res) {
	var errobj = error.err_insuff_params(res, req, ["key"]);
	if(!errobj) {
		return;
	}
	var key = req.query.key;
	Content.findOne({key:key},function(err,content) {
		if(err) {
			console.log(err);
			return;
		}
		if(content==null) {
			error.err(res,"709");
			return;
		}
		var value = content.value;
		res.end(JSON.stringify({result:true,data:value}));
	});
});

router.get('/create',function (req, res) {

	var user = req.user;
	if(!(user.type=="Admin")) {
		error.err(res,"909");
		return;
	}

	var errobj = error.err_insuff_params(res, req, ["key","value"]);
	if(!errobj) {
		return;
	}
	var key = req.query.key;
	var value = req.query.value;

	var content = new Content({key:key,value:value});
	content.save(function (err) {
		if(err)	console.log(err);
	});
	res.end(JSON.stringify({result:true}));
});

module.exports = router;
