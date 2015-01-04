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
//console.log(arr.length);
var user={};
var k=0;
for(var i=0;i<arr.length;i++)
{   
	if(arr[i].associatedFlows&&arr[i].associatedFlows.length==2&&arr[i].role=='User')
	user[k++]=arr[i];
	//console.log(arr);
}
//console.log(user);
var vendor={};
var v=0;
for(var i=0;i<arr.length;i++)
{   
	if(arr[i].associatedFlows&&arr[i].associatedFlows.length==1&&arr[i].role=='Vendor')
	vendor[v++]=arr[i];
	}
//console.log(vendor);
for(var i=0;i<k;i++)
{
  var nuser = new User({
  	type:"facebook",
  	social_id:user[i].profile.fb_socialId,
  	username:user[i].profile.first_name
  });
  debugger;
  nuser.save();
}