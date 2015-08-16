// Load layer0 framework.
require("../../init");
var q = require("Q");
var _ = require("underscore");

var registry = global.registry;

var usersM = registry.getSharedObject("models_User");
var checkinsM = registry.getSharedObject("models_Checkin");

var context = {};

usersM.find({}).then( function( users ){
	context.users = users;

	_.each( users, function( user ){
			return checkinsM.find({user:user._id, state:1}).then( function( checkins ){
				var offers = _.map( checkins, function( checkin ){ return checkin.offer });
				user.used_offers = offers;
				return user.save()
			});
	});

});
