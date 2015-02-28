/*var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var models = require('./models');
var error = require("./error");
var _ = require('underscore');
var Vendor = models.Vendor;
var CheckIn = models.CheckIn;
var Review = models.Review;
var vendorStats = {};

router.get('/', function(req, res) {
	var errobj = error.err_insuff_params(res,req,["access_token"]);
	if(!errobj) {
		return;
	}

	var userobj = req.user;

	if(user.type=="Vendor") {
		CheckIn.find({vendor:userobj.vendor_id, $where:"this.date_created>userobj.dateLastLogout;"}, function(err, latestCheckins) {
			if(err) {
				console.log(err);
				return;
			}
			vendorStats.latestCheckins = latestCheckins;

			Review.find({checkin})

		});
	}

});
//No need of this*/