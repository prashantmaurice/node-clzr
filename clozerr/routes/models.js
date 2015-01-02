var mongoose = require("mongoose");

var Models = {};

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

Models.Vendor = mongoose.model('Vendor',new Schema({

	location : {type:[Number],index:'2dsphere'} ,
	name:String,
	offers : [ObjectId],
	image : String,
	offers_old : [ObjectId],
	fid:String,
	dateCreated:Date

}));

Models.CheckIn = mongoose.model('CheckIn',new Schema({
	user:ObjectId,
	vendor:ObjectId,
	offer:ObjectId,
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
  account:ObjectId
}));

Models.Offer = mongoose.model('Offer',new Schema({

	type:String,
	stamps:String,
	dateCreated:Date,
	caption:String,
	description:String

}));;

module.exports = Models;
