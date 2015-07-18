var push = require('./push');
var settings = require('../settings');
var mongoose=require('mongoose');
var db=mongoose.connection;
var Models = require('../models');
var Vendor = Models.Vendor;
var User = Models.User;
var Checkin = Models.CheckIn;
var _ = require('underscore');

db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);
debugger;
console.log('mongodb opened');
Vendor.find({"settings":{$exists:true},"settings.visitReminder" : {$exists:true},"settings.visitReminder.activated" : {$exists : true}, "settings.visitReminder.activated" : true}, function(err, allVendors) {
	var visitDays = _.max(allVendors, function(dvendor) {
		return dvendor.settings.visitReminder.days;
	}).settings.visitReminder.days;

	var allVendorIds = [];
	console.log(allVendors);
	_.each(allVendors, function(ivendor, index, list0) {
		allVendorIds.push(ivendor._id+"");
	});

	console.log(allVendorIds);

	console.log("allVendorIds");
	//console.log(allVendorIds);

	console.log(visitDays);

	var visitmSecs = visitDays*24*60*60*1000;

	console.log(visitDays);
	console.log(visitmSecs);

	var currentDate = new Date();
	var initDate = new Date();
	initDate.setTime(initDate.getTime() - visitmSecs);

	console.log(initDate);
	console.log(currentDate);

	Checkin.find({date_created: {
		$gte : initDate,
		$lt : currentDate,
	}, 
	vendor : {$in : allVendorIds}}, function(err, allLatestCheckins) {
	//partition by vendors

	console.log("allLatestCheckins");
	console.log(allLatestCheckins);

	var grpVendors = _.groupBy(allLatestCheckins, function(lCheckin) {
		return lCheckin.vendor;
	});

	console.log("grpVendors");
	//console.log(grpVendors);

	//further partition by user

	var grpUsers_V = [];

	_.each(grpVendors, function(arrCheckins_V, key, list1) {
		//arrCheckins_V -- array of checkin objects for each vendor
		grpUsers_V[key] = _.groupBy(arrCheckins_V, function(checkins_V) {
			return checkins_V.user;
		});


		console.log("grpUsers_V[key]");
		//console.log(grpUsers_V[key]);

		_.each(grpUsers_V[key], function(arrCheckins_V_U, key, list2) {
			var latestCheckin_V_U = _.max(arrCheckins_V_U, function(checkin_V_U) {
				return checkin_V_U.date_created;
			});

	//get latest checkin in user	
	
	var cVendor = _.find(allVendors, function(sVendor) {return sVendor._id == latestCheckin_V_U.vendor.toString()});
	//console.log("cVendor");
	//console.log(cVendor);

	if(currentDate.getTime() - latestCheckin_V_U.date_created.getTime() > cVendor.settings.visitReminder.days*1) {

		User.findOne({_id:latestCheckin_V_U.user}, function(err, fUser) {
		//sending a push notification
		console.log("pushed to ");
		//console.log(fUser);
		push.sendPushNotification(fUser.gcm_id, { type: "STANDARD", title: "Visit reminder", message: cVendor.settings.visitReminder.message, messagePrefix: cVendor.settings.visitReminder.messagePrefix });

	});
	}

});
	});

});

});