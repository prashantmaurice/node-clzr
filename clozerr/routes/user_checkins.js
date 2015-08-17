/*
 * Migration script to store checkins in used_offers 
 * field for faster indexing.
 * Also restructures rewards into an object with multiple
 * labelled lists used for efficient expiry handling.
 */

// Load layer0 framework.
require("./layer0/init");

console.log("finished building environment");
var q = require("Q");
var _ = require("underscore");

var registry = global.registry;

var usersM = registry.getSharedObject("models_User");
var checkinsM = registry.getSharedObject("models_Checkin");

var context = {};

usersM.find({}).then( function( users ){
	context.users = users;
    
	_.each( users, function( user, index ){
            console.log("Migrating User " + index + " out of " + users.length + " : " + user._id);

        
            // Check if it's still an array.
            if( user.rewards && user.rewards.length != undefined ){
                console.log("Mapping " + user.rewards.length + " rewards for " + index + " : " + user._id );
                user.rewards = { current: user.rewards, gifting:[] }; //Migrate.
            }else{
                console.log("No rewards to map ");
                user.rewards = { current: [], gifting:[] };
            }
			
            
            return checkinsM.find({user:user._id, state:1}).then( function( checkins ){
				
                console.log("Mapping " + checkins.length + " used offers for: " + index + " : " + user._id );
                var offers = _.map( checkins, function( checkin ){ return checkin.offer });
				user.offers_used = offers;
                
                // Update user.
				return user.save();
			    
            });
	});

});
