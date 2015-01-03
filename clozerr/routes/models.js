var mongoose = require("mongoose");

var Models = {};

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var vendorSchema = new Schema({

	location : {type:[Number],index:'2dsphere'} ,
	name:String,
	offers : [ObjectId],
	image : String,
	offers_old : [ObjectId],
	fid:String,
	date_created:Date

});
vendorSchema.index({ location: '2d' });

Models.Vendor = mongoose.model('Vendor', vendorSchema );

Models.CheckIn = mongoose.model('CheckIn',new Schema({
	user:ObjectId,
	vendor:ObjectId,
	offer:ObjectId,
	state:Number,
	date_created:Date,
	pin:String,
	gcm_id:String
} ));

Models.User = mongoose.model('User',new Schema({
    id_type:String,
    social_id:String,
    type:String,
    vendor_id:String,
    stamplist:Object,
    username:String,
    password:String
}));

Models.Token = mongoose.model('Token',new Schema({
  access_token:String,
  account:ObjectId
}));

Models.Offer = mongoose.model('Offer',new Schema({

	type:String,
	stamps:String,
	date_created:Date,
	caption:String,
	description:String,
    date_updated:Date
}));;

module.exports = Models;
