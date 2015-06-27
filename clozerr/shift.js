var mongoose=require('mongoose');
var models = require('./routes/models');
var Vendor = models.Vendor;
var db=mongoose.connection;
var User = models.User;
var settings = require('./routes/settings');
var _ = require("underscore");
var list={"Cafe Adoniya":0,
"Bobacha":0,
"Mash":0,
"The Stop":0,
"Kaidi Kitchen":0,
"Kickstart Cafe":0,
"New Town":0,
"Chennai Chillin":0,
"Peaches":0,
"Little Italy - Anna Nagar":0,
"That Madras Place":0,
"Olive and Basil":0};
db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);
User.find({},function(err,users)
{   if(err)
	console.log(err);
	else
	{
	_.each(users,function(user){
		//console.log(_.keys(_.omit(user.stamplist,['STANDARD','DEFAULT'])));
        var stamplist = _.keys(_.omit(user.stamplist,['STANDARD','DEFAULT']));
        Vendor.find({fid:stamplist},function(err,vendors){
          //console.log(vendors);
          _.each(vendors,function(vendor){
          	//console.log(vendor.name);
          	debugger;
          	list[vendor.name]= list[vendor.name]+1;
          	console.log(vendor.name);
          	//console.log(list);
          })
        })
	})
}
})