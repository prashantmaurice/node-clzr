var mongoose = require("mongoose");

var Models = {};

var Schema = mongoose.Schema;

Models.Vendor = mongoose.model('Vendor',new Schema({

	location : {type:[Number],index:'2dsphere'} ,
	name:String,
	offers : [String],
	image : String,
	offers_old : [String],
	fid:String,
	dateCreated:Date

}));

Models.CheckIn = mongoose.model('CheckIn',new Schema({
	user:String,
	vendor:String,
	offer:String,
	state:Number,
	date_created:Date,
	pin:String
}

Models.User = mongoose.model('User',new Schema({
    id_type:String,
    social_id:String,
    type:String
}));

Models.Token = mongoose.model('Token',new Schema({
  access_token:String,
  facebook_id:Number
}));

Models.Offer = mongoose.model('Offer',new Schema({

	type:String,
	stamps:String,
	dateCreated:Date,
	caption:String,
	description:String

}));;

module.exports = Models;
