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
	date_created:Date,
    dateUpdated:Date,
	address: String,
	city: String,
	phone: String,
	visible: Boolean,
	description: String,
	resource_name: String,
	question : [String]
});
vendorSchema.index({ location: '2d' });

Models.Content = mongoose.model('Content',new Schema({
	key:String,
	value:String
}));

Models.Vendor = mongoose.model('Vendor', vendorSchema );

Models.CheckIn = mongoose.model('CheckIn',new Schema({
	user:ObjectId,
	vendor:ObjectId,
	offer:ObjectId,
	state:Number,
	date_created:Date,
	pin:String,
	gcm_id:String,
	validate_data:Schema.Types.Mixed
} ));

Models.User = mongoose.model('User',new Schema({
	social_id:String,
	type:String,
	vendor_id:String,
	stamplist: Schema.Types.Mixed,
	username:String,
	password:String,
	auth_type:String,
	profile: Schema.Types.Mixed,
	date_created:Date,
	upgraded:Date,
	gcm_id: String
}));

Models.Token = mongoose.model('Token',new Schema({
	access_token:String,
	account:ObjectId
}));

Models.VendorRequest = mongoose.model('VendorRequest', new Schema({
	account:ObjectId,
	name:String,
	remarks:String
}));

Models.Offer = mongoose.model('Offer',new Schema({

	type:String,
	stamps:String,
	date_created:Date,
	caption:String,
	description:String,
	dateUpdated:Date
}));
Models.Review = mongoose.model('Review',new Schema({
	checkinid:ObjectId,
	stars:[Number],
	date_created:Date
}));

module.exports = Models;
