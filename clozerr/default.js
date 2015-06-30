var mongoose=require('mongoose');
var models = require('./routes/models');
var Vendor = models.Vendor;
var Offer = models.Offer;
var db=mongoose.connection;
var User = models.User;
var settings = require('./routes/settings');
var _ = require("underscore");
 db.open('mongodb://mongoadmin:clozerradmin@localhost:6547/fin4');
 var rewards = ["welcomeReward","limitedCustomers","limitedTime","happyHours"];
 _.each(rewards,function(reward){
  var offer = new Offer({
    	type: "S0",
    	dateCreated: Date.now(),
    	caption: settings[reward].caption,
    	description: settings[reward].description,
        params: settings[reward].params
	});
	 offer.save(function (err,offer) {
	    	if (err) console.log(err);
	    	else
	    	{   //console.log(offer);
	    		Vendor.update({},{$push:{offers:offer._id}},{multi:true},function(err,vendor){
	    		  console.log(vendor);	
	    		})
	    	}
	    });	
	 });

