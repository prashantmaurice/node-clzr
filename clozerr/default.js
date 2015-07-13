var mongoose=require('mongoose');
var models = require('./routes/models');
var Vendor = models.Vendor;
var Offer = models.Offer;
var db=mongoose.connection;
var User = models.User;
var settings = require('./routes/settings');
var _ = require("underscore");
 db.open('mongodb://mongoadmin:clozerradmin@localhost:9999/fin4');
 var rewards = ["welcomeReward"];
 _.each(rewards,function(reward){
     params={
           type: "S0",
           dateCreated: Date.now(),
           caption: settings[reward].caption,
           description: settings[reward].description,
         params: settings[reward].params
       }
     Vendor.find({},function(err,vendors){
         if(err){
              console.log(err);
              return;
         }
        console.log('got vendors'+vendors.length);
        _.each(vendors,function(vendor){
            var offer = new Offer(params);
            offer.save(function(err,offer){
                if(err){
                     console.log(err);
                     return;
                }

                var id=offer._id;
                vendor.offers.push(offer._id);
                vendor.markModified('offers')
                vendor.save(function(err,vendor){
                    if(err){
                         console.log(err);
                         return;
                    }
                    console.log(vendor.id)
                });
            });

        })
     })
 });
