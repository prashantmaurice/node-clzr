var registry = global.registry;
var Q = require("q");
var _ = require('underscore')
var fuzzy = require('fuzzy');
var FB = require('fb');
var Twitter = require('twitter');
var settings = registry.getSharedObject("settings");
var wa = require('whatsapi');
FB.options({appSecret:'0fa93f920497bc9a26c63d979f840d1f',appId:'643340145745435'});
var client = new Twitter({
  consumer_key: '6slwOZToBf6Zpmm3Y7yTgtxMK',
  consumer_secret: 'BA9eyLuCNm8VNXoCzNslnSXjy4fr6dRq0MPlyol7mZgS94F1xT',
  access_token_key: '3248033851-DFggbOU6HmjhEKK6mczTifALccZnF2qfZv6tew4',
  access_token_secret: 'fHK5hLuKbAD5aAaUqICpizHkJE7yOYmw6m63AFA6sHsiu'
});
var hat = require("hat");
var rack = hat.rack(10, 10);
var ObjectId = require('mongoose').Schema.ObjectId;

function getVendorType(vendor) {
    debugger;
    if(vendor.settings.sxEnabled == true || vendor.settings.sxEnabled == "true") {
        return "SX";
    }
    else {
        return "S1";
    }
}


var view_vendor_details_get = function( params ) {

    return registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
        if( !vendor )
            throw { code : 351, description : "No such vendor" };

        vendor.visitOfferId = registry.getSharedObject("settings").defaultOffer;
	    return vendor;

    });

}

// DEPRECATED.. Doesn't look good anyway.
/*var view_vendor_offersPage = function( params ){
    console.log("OfferPage Main View");
    var deferred = Q.defer();

    var vendorObjectM = registry.getSharedObject("data_vendor");
    var userObjectM = registry.getSharedObject("live_session");

    var vendor_obj = null;
    vendorObjectM.get( params ).then(function( vendor ){
        vendor_obj = vendor.toJSON();
        debugger;
        return userObjectM.get( params );
    }, function( err ){
        deferred.resolve({code:500,error:err});
    }).then( function( user ){
        var typeSpecificM = registry.getSharedObject("view_vendor_offers_offersPage_" + getVendorType(vendor_obj));
        debugger;
        return typeSpecificM.get( params, vendor_obj, user );
    }, function( err ){
        console.log(err);
        deferred.resolve({code:500,error:err});
    })
    .then(function( res ){deferred.resolve( res )}, function( err ){ deferred.resolve({code:500,error:err}); });
    console.log('returning from view_vendor_offers_offersPage');
    return deferred.promise;
}*/

// TODO: Change handler_predicate to something nicer.
var view_vendor_allOffers = function(params,user){
    //add SX params
    var deferred = Q.defer();
    var context = { params: params, user:user };

	return registry.getSharedObject("data_vendor_withOffers").get(params).then(function(vendor){
        var plist=[]
        vendor.offers_filled=_.filter(vendor.offers_filled,function(offer){
            return (offer.type=="S1")||(offer.type=="SX")
        })
		context.vendor = vendor;
        return Q.all(_.map(vendor.offers_filled,function(offer){
            return registry.getSharedObject("handler_predicate").get(user,vendor,offer);
        }))
    }).then( function( validlist ){
            
	    context.vendor.offers_filled=_.map(_.zip( context.vendor.offers_filled, validlist ),function(offerpair){
                if(!offerpair[0].params)
                    offerpair[0].params={}
                offerpair[0].params.unlocked=offerpair[1]
                return offerpair[0]
        })
        return context.vendor;
    }).then(function(vendor){
        var offersplist=[]

		// Check if an offer has been used or not.	
        _.each(context.vendor.offers_filled,function(offer){
            offersplist.push(Q(registry.getSharedObject("data_checkins").get({
                user:user._id,
                offer:offer._id,
                state:1//CHECKIN_CONFIRMED
            })).then(function(checkins){
				return offer.params.used=(checkins.length>0)
			}));
        })
        return Q.all(offersplist)
	}).then(function(usedlist){

		// Remove the used offers.
        context.vendor.offers_filled=_.map(_.zip(context.vendor.offers_filled,usedlist),function(offerpair){
            offerpair[0].params.used=offerpair[1]
            return offerpair[0]
        })
        return context.vendor;

    }).then(function(vendor){
        debugger;
		// Run the display function of every offer to morph it into the right type.
		var vendor = context.vendor;
        vendor.offers_filled=_.map(vendor.offers_filled,function(offer){
            if(offer.stamps)
                offer.params.stamps=offer.stamps
            return registry.getSharedObject('display').offerDisplay(offer)
        })
		if(!user.stamplist)
            user.stamplist=[]
        if(!user.stamplist[vendor.fid])
            user.stamplist[vendor.fid]=0
		
		
        vendor.offers=vendor.offers_filled;
        console.log( user.stamplist );
		console.log( "OFFERS:: ");
		console.log( vendor.offers );

		vendor.stamps=user.stamplist[vendor.fid]
        vendor.visitOfferId = registry.getSharedObject("settings").defaultOffer;

        return Q(vendor);
	})
}

function assign_keys(obj_ori, obj_in, key) {
    if(typeof obj_in[key] == 'object') {
        for(k in obj_in[key]) {
            assign_keys(obj_ori[key], obj_in[key], k);
        }
    }
    else if(obj_in[key]) {
        obj_ori[key] = obj_in[key];
    }
}

/*
 *	Takes a stringified version of the patch object( to preserve type data ).
 *	Parses it and patches it onto the existing vendor object.
 */
var view_vendor_details_patch = function( params, user ){

    var vendorObjectM = registry.getSharedObject("data_vendor");

    
    if(user.type != "Vendor") {
        throw { code:467, description:"user is not a vendor" };    
    }

    if(user.vendor_id != params.vendor_id) {
        throw { code:468, description:"user is not associated with this vendor" };    
    }

	var patch = JSON.parse( params.data );
	
	var util = registry.getSharedObject("util");
    return vendorObjectM.get( params ).then(function(vendor) {
		util.patchObject( vendor, patch );
		//console.log( vendor.description );
		//console.log( patch );
		//vendor.description = patch.description;
		//console.log( vendor.save );
		return vendor.save();
    });
}

/*
 * Vendor Details Set function sets details of the vendor object.
 * Input: key-value pairs as URL parameters.
 */

var view_vendor_details_set = function( params, user ) {

    var vendorObjectM = registry.getSharedObject("data_vendor");

    
    if(user.type != "Vendor") {
        throw { code:467, description:"user is not a vendor" };    
    }

    if(user.vendor_id != params.vendor_id) {
        throw { code:468, description:"user is not associated with this vendor" };    
    }

    return vendorObjectM.get( params ).then(function(vendor) {

        if( !params.vendor ) {
            throw { code:469, description:"No vendor object in the request" };    
        }
        
        for(key in params.vendor) {
                console.log('setting vendor property '+key+' to '+params.vendor[key])
                vendor[key] = params.vendor[key];                
        }

        return vendor.save();
    });

}

var view_vendor_details_update = function( params, user) {
    //params.modify contains the field to be modified
    //params.operation is the operation to be performed -- add , remove
    //params.values contains the array to be added or removed

    var deferred = Q.defer();

    var vendorObjectM = registry.getSharedObject("data_vendor");
    var userObjectM = registry.getSharedObject("live_session");
    var arrayOperations = registry.getSharedObject("util").arrayOperations;

    userObjectM.get( params ).then(function(user) {
        debugger;
        if(user.type == "Vendor") {
            if(user.vendor_id == params.vendor_id) {
               vendorObjectM.get( params ).then(function(vendor) {
                console.log('changing ' + params.modify + ' to '+params.operation+' '+JSON.stringify(params.values))
                console.log('current value '+ JSON.stringify(vendor[params.modify]))
                vendor[params.modify] = arrayOperations[params.operation](vendor[params.modify], params.values);
                vendor.markModified(params.modify);
                deferred.resolve(Q(vendor.save()));
            }, function(err) {
                deferred.resolve({code:500,error:err});
            });
           }
           else {
            deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
        }
    }
    else {
        deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
    }
}, function(err) {
    deferred.resolve({code:500,error:err});
});

return deferred.promise;

}

var view_vendor_homepage = function( params, user ){
    var deferred = Q.defer();

    var vendorObjectsM = registry.getSharedObject("data_vendors");// Data object to get multiple vendors based on certain parameters.

    var vendorListF = [];
    vendorObjectsM.get( params ).then(function( vendors ){
        var prList = [];
        debugger;
        for( var i = 0; i < vendors.length; i++ ){
            var typeSpecificM = registry.getSharedObject("view_vendor_homepage_" + vendors[i].type);
            vendor_obj = vendor;
            var fI = i;
            var pr = typeSpecificM.get( params, vendor, user ).then( function( vendor ){ vendorListF[fI] = vendor }, function( err ){ deferred.resolve({code:500,error:err}); } );
            prList.push( pr );
        }
        return Q.all(prList);
    }, function( err ){
        deferred.resolve({code:500,error:err});
    }).then( function( user ){
        deferred.resolve( vendorListF );
    }, function( err ){
        deferred.resolve({code:500,error:err});
    }).done();

    return deferred.promise;
}


var view_category_list = function(params,user) {
    return Q(registry.getSharedObject("settings").categories)
}

var view_vendor_search_near=function(params,user){
    /*
    search params :
        name - vendor.name (fuzzy)
        tag - vendor.tags (containing tag)
        category - vendor.category
        */
        //var deferred = Q.defer();
	    
    
        var util = registry.getSharedObject("util");
        limit=params.limit || registry.getSharedObject("settings").api.default_limit;
        offset=params.offset || 0;

        if(!params.latitude || !params.longitude)
            throw {code:500,description:"distance params missing"};

        return registry.getSharedObject("data_vendor_near").get(params,user).then(function(vendors){
            return vendors;
        }).then(function(vendors){
            debugger;
            if(params.name){
                return _.map(registry.getSharedObject("search").fuzzy(params.name,vendors,{
                    extract:function(el){
                        return el.name;
                    }
                }),function(el){
                    return el.original;
                })
                return vendors
            }
            else
                return vendors;
        })
        .then(function(vendors){

            if(params.tag){
                return registry.getSharedObject("data_tag").get({name:params.tag}).then(function(tag){
                    return _.filter(vendors,function(vendor){
                        return vendor.tags.indexOf(tag.id)!=-1
                    })
                })
            } else
            return vendors;
        })
        .then(function(vendors){
            if(params.category){
                return _.filter(vendors,function(vendor){
                    return vendor.category==params.category
                })
            } else
            return vendors;
        })
        .then(function(vendors){
            return _.map(vendors,function(vendor){
                return util.vendorDistDisplay(vendor,params.latitude,params.longitude);
            });
        })
}

    var view_vendor_gallery_upload = function(params, user) {
        var deferred = Q.defer();

        registry.getSharedObject()

        return deferred.promise;
    }
    var view_vendor_facebook_promote = function(params,user){
        var deferred = Q.defer();
        FB.setAccessToken(params.fb_token);
        if(!params.message)
            params.message = "Join The Clozerr Loyalty Space!!";
        if(!params.picture)
            params.picture = "https://lh5.ggpht.com/cYqMv2ndv94UmhKDiJenndFbVG6RPk0RNsHmZsvgIOxIqGi7UyVmW99j_C9Fv6YbSmEy=w300";
        if(!params.link)
            params.link = "http://www.clozerr.com";
        if(!params.name)
            params.name = "Clozerr!!";
        if(!params.caption)
            params.caption = "Clozerr is an IIT Madras Start Up!!!"
        var body = {
          message : params.message,
          picture: params.picture,
          link:params.link,
          name:params.name,
          caption:params.caption,
          description:params.description
      };
      FB.api('/me/feed','post',body,function(result){
        registry.getSharedObject("data_vendor").get(params).then(function(vendor){
            vendor.last_post = Date.now();
            vendor.save();
        });
        deferred.resolve(result);
    })
      return deferred.promise;
  }


  var view_vendor_twitter_promote = function(params,user){

    var deferred = Q.defer();
    var body={
        status:params.status
    }
    client.post('statuses/update', body,  function(error, tweet, response){
      if(error) throw error;
        console.log(tweet);  // Tweet body.
        console.log(response);  // Raw response object.
        registry.getSharedObject("data_vendor").get(params).then(function(vendor){
            vendor.last_tweet = Date.now();
            vendor.save();
        });
        deferred.resolve(response);
    });
    return deferred.promise;
}


var view_vendor_checkins_active = function(params, user) {
    if(user.type != "Vendor") {
        throw { code:481, description: "user is not a vendor" };
    }
    if(user.vendor_id.toString() != params.vendor_id) {
        throw { code:483, description: "user is not associated with vendor." };
    }

    return registry.getSharedObject("data_vendor_checkins_active").get(params);
}

var view_vendor_checkins_confirmed = function(params, user) {

    if(user.type != "Vendor") {
        throw { code:491, description: "user is not a vendor" };
    }
    if(user.vendor_id.toString() != params.vendor_id) {
        throw { code:493, description: "user is not associated with vendor." };
    }

    return registry.getSharedObject("data_vendor_checkins_confirmed").get(params);
}

var view_vendor_checkins_cancelled = function(params, user) {
    if(user.type != "Vendor") {
        throw { code:431, description: "user is not a vendor" };
    }
    if(user.vendor_id.toString() != params.vendor_id) {
        throw { code:433, description: "user is not associated with vendor." };
    }

    return registry.getSharedObject("data_vendor_checkins_confirmed").get(params);
}

var view_vendor_details_create = function(params, user) {
    
    var Vendor = registry.getSharedObject("models_Vendor");
    var obj = registry.getSharedObject("util").filterObject(params, ["name", "location", "image", "description", "address", "phone"]);

    if(!obj.result) {
        throw { code:344, description:obj.err };
    }
    
    var vendor_new = new Vendor(obj.data);
        
    vendor_new.date_created = new Date();
    vendor_new.dateUpdated = vendor_new.date_created;
    vendor_new.resource_name = vendor_new._id;
    vendor_new.visible = true;
    vendor_new.test = false;
    vendor_new.fid = rack();
    
    return vendor_new.save(); 

}
var getBeaconFormat=function(params,user,vendor){
    if(vendor.geoloc && vendor.geoloc==true)
        return {
            _id: vendor.id,
            beacons: vendor.beacons,
            name: vendor.name,
            location: vendor.location
        }
        else
            return {
                _id: vendor.id,
                beacons: vendor.beacons,
                name: vendor.name
            }
        }

var view_vendor_beacons_all = function(params, user) {
    var deferred = Q.defer();
    limit=params.limit || registry.getSharedObject("settings").api.default_limit;
    offset=params.offset || 0;
    vendorList=[];
    registry.getSharedObject("data_vendors").get( { "beacons": { $exists: true } } ).then(function(vendors){
        _.each(vendors,function(vendor){
            if(vendor.type && vendor.type=="TestVendor") {
                if(user.type && user.type=="TestUser") {
                    vendorList.push(getBeaconFormat(params,user,vendor))
                }
            } else {
                vendorList.push(getBeaconFormat(params,user,vendor))
            }
        })
        deferred.resolve({
            UUID:registry.getSharedObject("settings").UUID,
            vendors:vendorList
        })
    })
    return deferred.promise;
}
/*var view_vendor_club_members = function(params,user){
    var deferred = Q.defer();
    registry.getSharedObject("data_vendor").get(params).then(function(vendor){
       registry.getSharedObject("data_club_members").get(vendor).then(function(users){
        console.log(users);
        deferred.resolve(users);
       });
    })
    return deferred.promise;
}*/
var view_vendor_offers_active = function(params,user){
    var deferred = Q.defer();
    registry.getSharedObject("data_vendor_withOffers").get(params).then(function(vendor){
        deferred.resolve(vendor);
    });
    return deferred.promise;
}
var view_vendor_users_visited = function(params,user){
    var deferred = Q.defer();
    registry.getSharedObject("data_vendor").get({vendor_id:params.vendor_id}).then(function(vendor){
        var field="stamplist."+vendor.fid
        query_param={}
        query_param[field]={$exists:true}
        console.log()
        registry.getSharedObject("data_user").get(query_param).then(function(users){
            deferred.resolve(users);
        })
    })
    return deferred.promise;
}
var view_vendor_geofences_add = function(params, user) {
    var deferred = Q.defer();

    var ObjectId = require('mongoose').Schema.ObjectId;
    var Vendor = global.registry.getSharedObject("models_Vendor");

    if(user.type == "Vendor") {
        if(user.vendor_id == params.vendor_id) {
            global.registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
                debugger;
                Vendor.update({
                    _id : params.vendor_id
                }, {
                    $addToSet : {
                        geofences : params.geofence_id
                    }
                }).exec().then(function(num) {
                    debugger;
                    vendor = JSON.parse(JSON.stringify(vendor));
                    vendor.geofences.push(params.geofence_id);
                    deferred.resolve(vendor);
                }, function(err) {
                    deferred.reject(err);
                });
            });
        }
        else {
            deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
        }
    }
    else {
        deferred.resolve(registry.getSharedObject("view_error").makeError({ error:{message:"Permission denied"}, code:909 }));
    }

    return deferred.promise;
}
var view_vendor_offers_unlocked=function(params,user){
  //var deferred = Q.defer();
    if(!params.vendor_id){
        throw { code:351, description:"No vendor_id provided." };
    }

    var context = { user: user, params: params };

    return Q.all([registry.getSharedObject("view_vendor_offerspage").get(params,user)
                    ,registry.getSharedObject("view_vendor_offers_rewardspage").get(params,user)]).then(function(off_rew){
        
        context.off_rew = off_rew;
        console.log( off_rew );
		// Get all unlocked and unused offers from offerspage URL.
        var offers = _.filter(off_rew[0].offers,function(offer){
            return offer.params.unlocked && !offer.params.used;
        });

        // Concatenate the rewards specific to this vendor with the offers.
        var rewards = _.filter(off_rew[1].rewards, function( reward ){
			return reward.unlocked;
		});

        off_rew[0].offers=offers.concat(rewards)
      
        var display = registry.getSharedObject("qualify");
     	console.log("UNLOCKED:");

	    console.log( off_rew[0].offers ); 
	    return Q.all( _.map(off_rew[0].offers, function( offer ){
		
            return display.getOfferDisplay( user, off_rew[0], offer, false );
	    
        }) );

    }).then( function( offers ){ 
		console.log( offers );
		context.off_rew[0].offers = offers;
      	return context.off_rew[0];

	});
  
}
var view_vendor_offers_rewardspage=function(params,user){
   
    var context = {params: params, user:user };

    if( params.vendor_id ){

        return Q.all([registry.getSharedObject("view_vendor_offers_offers_S0").get(params,user)
                    ,registry.getSharedObject("view_offers_rewards_user").get(params,user)])
        .then(function( rewards_s0 ){

			// Set unlocked = true for rewards to maintain symmetry.
			rewards_s0[1] = _.map( rewards_s0[1], function( reward ){ reward.unlocked = true; return reward; } );

            console.log( rewards_s0 );
            return rewards_s0[0].concat(rewards_s0[1]);

        }).then(function( rewards ){
            
            context.rewards = rewards;
            return registry.getSharedObject("data_vendor").get(params)
            
        }).then(function( vendor ){
            var rewards = context.rewards;
            var _vendor = vendor.toObject()
            _vendor.rewards = _.filter(rewards,
                    function(reward){

                        // Handle exclusive rewards.
                        if( reward.vendor && reward.vendor._id ){
                            
                            console.log(reward.vendor_id);
                            console.log(vendor._id);
                            return reward.vendor._id.toString() == vendor._id;

                        }

                        // For all other rewards.
                        return true;
                    }
            );
		
            // Modify the vendor object a bit first.
            _vendor.visitOfferId = registry.getSharedObject("settings").defaultOffer;

            return Q(_vendor);
        });

    } else {
        return registry.getSharedObject("view_offers_rewards_user").get(params,user)
    }
}

var is_vendor_request=function(vendor_id,user){
    return (user.type=='Vendor') && (user.vendor_id==vendor_id)
}

var view_vendor_club_get = function(params,user){
    
    if(!user.type=='Vendor')
        throw { err: 361, description:"user is not vendor" };

    
    return registry.getSharedObject("data_vendor").get({vendor_id:user.vendor_id}).then(function(vendor){
        var field="stamplist."+vendor.fid;
        query_param={};
        query_param[field]={$exists:true}
        query_param[field]={$gt:0}
        return registry.getSharedObject("data_user").get(query_param);
    });

}

global.registry.register("view_vendor_geofences_add", { get : view_vendor_geofences_add });

global.registry.register("view_category_list", {get:view_category_list});
global.registry.register("view_vendor_homepage", {get:view_vendor_homepage});

global.registry.register("view_vendor_facebook_promote",{get:view_vendor_facebook_promote});
global.registry.register("view_vendor_twitter_promote",{get:view_vendor_twitter_promote});
//global.registry.register("view_vendor_offersPage", {get:view_vendor_offersPage});
global.registry.register("view_vendor_offerspage", {get:view_vendor_allOffers});
global.registry.register("view_vendor_search_near", {get:view_vendor_search_near,post:view_vendor_search_near});
global.registry.register("view_vendor_beacons_all", {get:view_vendor_beacons_all});

global.registry.register("view_vendor_offers_active",{get:view_vendor_offers_active});
global.registry.register("view_vendor_checkins_active", {get:view_vendor_checkins_active});
global.registry.register("view_vendor_checkins_confirmed", {get:view_vendor_checkins_confirmed});
global.registry.register("view_vendor_checkins_cancelled", {get:view_vendor_checkins_cancelled});
//global.registry.register("view_vendor_club_members",{get:view_vendor_club_members});

global.registry.register("view_vendor_details_get", {get:view_vendor_details_get});
global.registry.register("view_vendor_details_create", {get:view_vendor_details_create});
global.registry.register("view_vendor_details_update", {get:view_vendor_details_update});
global.registry.register("view_vendor_details_set", {get:view_vendor_details_set});
global.registry.register("view_vendor_details_patch", {get:view_vendor_details_patch});

global.registry.register("view_vendor_users_visited", {get:view_vendor_users_visited});
global.registry.register("view_vendor_offers_rewardspage", {get:view_vendor_offers_rewardspage});
global.registry.register("view_vendor_allOffers", {get:view_vendor_allOffers});
global.registry.register("view_vendor_club_get", {get:view_vendor_club_get});
global.registry.register("view_vendor_offers_unlocked", {get:view_vendor_offers_unlocked});

//module.exports = {homepage:view_vendor_homepage, offerpage:view_vendor_offersPage};
