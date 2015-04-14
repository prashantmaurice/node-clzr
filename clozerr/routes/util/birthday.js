var push = require('./push');
var settings = require('../settings');
var mongoose=require('mongoose');
var db=mongoose.connection;
var Models = require('../models');
var Vendor = Models.Vendor;
var User = Models.User;
var _ = require('underscore');

db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);

Vendor.find({"settings":{$exists: true},"settings.birthday":{$exists: true},"settings.birthday.activated":{$exists: true},"settings.birthday.activated":true}, function(err, vendors) {
	//console.log(vendors);
	User.find({"profile.birthday":{$exists: true} , $where: function() {
		return ((new Date(this.profile.birthday)).getDate() == (new Date()).getDate() && (new Date(this.profile.birthday)).getMonth() == (new Date()).getMonth());
	}
}, function(err, bUsers) {
	//console.log('in callback');
	//console.log(bUsers);
	if(vendors) {
		vendors.forEach(function(currentVendor, posV, arrayV) {
			var user_list = [];
			bUsers.forEach(function(bUserOne, posU, arrayU) {
				var posc = bUserOne.stamplist[currentVendor.fid];
				
				if(posc*1 > -1) {
					user_list.push(bUserOne.gcm_id);
					console.log(bUserOne.gcm_id);
				}
			});
			push.sendMultiPushNotification(user_list, {type:"BIRTHDAY", vendor: currentVendor});
			user_list = [];			
		});
	}
});
});