var push = require('./push');
var settings = require('../settings');
var mongoose=require('mongoose');
var db=mongoose.connection;
var Models = require('../models');
var Vendor = Models.Vendor;
var User = Models.User;
var _ = require('underscore');
var currentDate = new Date();
var birthdayMsg = settings.birthday.birthdayWishMessage;
var compareDateString = currentDate.getDate() + "" + currentDate.getMonth() + currentDate.getFullYear();

db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);

Vendor.find({settings.notifyBirthday:true}, function(vendors) {
	User.find({}, function(allUsers) {
		var bUsers = _.filter(allUsers, function(userobj) {
			var userBirthDay = userobj.getDate() + "" + userobj.getMonth() + userobj.getFullYear();
			return userBirthDay == compareDateString;
		});
		vendors.forEach(function(currentVendor, posV, arrayV) {
			bUsers.forEach(function(bUserOne, posU, arrayU) {
				var posc = bUserOne.stamplist.indexOf(currentVendor.fid);
				var user_list = [];
				if(posc > -1) {
					user_list.push(bUserOne.gcm_id);
				}
			});
			push.sendMultiPushNotification(user_list, {birthdayWishMessage:currentVendor.name + " " + birthdayMsg});
			user_list = [];			
		});
	});
});

