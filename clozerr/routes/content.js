var express = require('express');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var error = require("./error");
var Content = models.Content;

router.get('/content', function(req,res) {
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
		res.send(JSON.stringify(content.value));
	});
});