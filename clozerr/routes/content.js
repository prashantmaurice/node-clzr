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
		}
		var value = content.value;
		res.end(JSON.stringify({result:true,data:value}));
	});
});

module.exports = router;