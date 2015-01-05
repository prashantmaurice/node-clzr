var express = require('express');
var mongoose=require('mongoose');
var models = require("./routes/models");
var fs=require('fs');
var crypto = require('crypto');
var Vendor = models.Vendor;
var Offer = models.Offer;
var settings = require('./routes/settings');
var User = models.User;
var db=mongoose.connection;
db.open('mongodb://'+settings.db.mongo.host+'/fin');
var data=fs.readFileSync('/home/raakesh/Documents/Clozerr data/Account.json' );
var arr = JSON.parse(data.toString()).results;
var dat=fs.readFileSync('/home/raakesh/Documents/Clozerr data/Vendor.json' );
var ary = JSON.parse(data.toString()).results;
for(var i=0;i<ary.length;i++)
{

}
var user={};
var k=0;
for(var i=0;i<arr.length;i++)
{
	if(arr[i].associatedFlows&&arr[i].associatedFlows.length==2&&arr[i].role=='User')
	user[k++]=arr[i];
}
var vendor={};
var v=0;
for(var i=0;i<arr.length;i++)
{
	if(arr[i].associatedFlows&&arr[i].associatedFlows.length==1&&arr[i].role=='Vendor')
	vendor[v++]=arr[i];
	}
for(var i=0;i<k;i++)
{
  var nuser = new User({
  	type:"User",
  	auth_type:"facebook",
  	social_id:user[i].profile.fb_socialId,
  	username:user[i].profile.first_name
  });
  nuser.save();
}
for(var i=0;i<v;i++)
{
	var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync( settings.auth.password.default, salt );
	var nuser = new User({
     type:"Vendor",
     auth_type:"password",
     username:vendor[i].username,
     password:hash,
     vendor_id:
	});
}
