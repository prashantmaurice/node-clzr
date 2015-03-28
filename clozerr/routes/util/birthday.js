var push = require('./push');
var settings = require('../settings');
var mongoose=require('mongoose');
var db=mongoose.connection;
var Models = require('../models');
var Vendor = Models.Vendor;
var User = Models.User;
var _ = require('underscore');
var currentDate = new Date();

db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);

Vendor.find({'settings.birthday.activated':true}, function(vendors) {
	User.find({"profile":{$exists: true} , $where: function() {
		return ((new Date(this.profile.birthday)).getDate() == currentDate.getDate() && (new Date(this.profile.birthday)).getMonth() == currentDate.getMonth());
	}
}, function(bUsers) {
	console.log('in callback');
	console.log(vendors);
	console.log(bUsers);
	if(vendors) {
		vendors.forEach(function(currentVendor, posV, arrayV) {
			bUsers.forEach(function(bUserOne, posU, arrayU) {
				var posc = bUserOne.stamplist.indexOf(currentVendor.fid);
				var user_list = [];
				if(posc > -1) {
					user_list.push(bUserOne.gcm_id);
				}
			});
			push.sendMultiPushNotification(user_list, {type:"BIRTHDAY", vendor: currentVendor});
			user_list = [];			
		});
	}
});
});