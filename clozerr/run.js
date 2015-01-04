var express = require('express');
var mongoose=require('mongoose');
var models = require("./routes/models");
var fs=require('fs');
var crypto = require('crypto');
var Vendor = models.Vendor;
var Offer = models.Offer;
var settings = require('./routes/settings');
var db=mongoose.connection;
var User = models.User;
var bcrypt = require("bcrypt-nodejs");

db.open('mongodb://'+settings.db.mongo.host+'/fin');
function random (howMany, chars) {
	chars = chars 
	|| "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
	var rnd = crypto.randomBytes(howMany)
	, value = new Array(howMany)
	, len = chars.length;

	for (var i = 0; i < howMany; i++) {
		value[i] = chars[rnd[i] % len]
	};

	return value.join('');
}

var links={};
var join=fs.readFileSync('/home/raakesh/Documents/Clozerr data/CouponVendorJoin.json');
var arry=JSON.parse(join.toString()).results;

var datu=fs.readFileSync('/home/raakesh/Documents/Clozerr data/Account.json' );
var aray = JSON.parse(datu.toString()).results;

var data=fs.readFileSync('/home/raakesh/Documents/Clozerr data/Vendor.json' );
var arr = JSON.parse(data.toString()).results;
var help={};

var dat=fs.readFileSync('/home/raakesh/Documents/Clozerr data/Coupon.json');
var ary=JSON.parse(dat.toString()).results;

for(var i=0;i<ary.length;i++)
{
	var desp={};
	for(var j=0;j<ary[i].offer.length;j++)
		desp[j]=ary[i].offer[j].caption;	
	var offer=new Offer({type:"S1",stamps:ary[i].visitCount,dateCreated:ary[i].createdAt,caption:ary[i].caption,description:desp});
	offer.save();
	links[ary[i].objectId] = offer._id;
}

for(var i=0;i<arr.length;i++)
{ 
	//console.log(i + "/" + arr.length);

	var offers = {};
	var k=0;
	for(var j=0;j<arry.length;j++)
 	{  if(arr[i].objectId==arry[j].vendor.objectId)
	   offers[k++]=links[arry[j].coupon.objectId]; }
	

	var vendor=new Vendor({
		location:[arr[i].location.latitude,arr[i].location.longitude],
		name:arr[i].caption,
		image:arr[i].image,
		fid:random(4,"1234567890"),
		date_created:arr[i].createdAt,
		offers:offers
	});
	    
	vendor.save();
  help[arr[i].objectId] = vendor._id; 
}

var user={};
var k=0;
for(var i=0;i<aray.length;i++)
{   
	if(aray[i].associatedFlows&&aray[i].associatedFlows.length==2&&aray[i].role=='User')
	user[k++]=aray[i];
}

var vendor={};
var v=0;
for(var i=0;i<aray.length;i++)
{   
	if(aray[i].associatedFlows&&aray[i].associatedFlows.length==1&&aray[i].role=='Vendor')
	vendor[v++]=aray[i];
	}
for(var i=0;i<k;i++)
{
	debugger;
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
     Vendor_id:help[vendor.objectId]
	});
	nuser.save();
}

