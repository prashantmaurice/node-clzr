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
	question : [String],
	beacons: Schema.Types.Mixed,
	test : Boolean,
	settings : Schema.Types.Mixed,
	visitOfferId : ObjectId,
	category : String,
	flags : [String],
	trials:Number,
	qrcodes:[String],
	gallery:[String],
	image_small:String,
	tags:[Schema.Types.ObjectId],
	club_members:Number,
	geoloc:Boolean,
	last_post:Date,
	last_tweet:Date
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
	dateLastLogin:Date,
	dateLastLogout:Date,
	upgraded:Date,
	gcm_id: String,
	favourites:Schema.Types.Mixed,
	pinned:Schema.Types.Mixed,
    stateList: Schema.Types.Mixed,
    lucky_rewards:Schema.Types.Mixed,
    failed_instances:Schema.Types.Mixed,
    rewards : [ObjectId],
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
	dateUpdated:Date,
	params: Schema.Types.Mixed
}));

Models.Review = mongoose.model('Review',new Schema({
	checkinid:ObjectId,
	stars:[Number],
	date_created:Date,
	remarks: String
}));

Models.Data = mongoose.model('Data',new Schema({
    type:String,
    content: Schema.Types.Mixed
}));
Models.Tag = mongoose.model('Tag',new Schema({
	name:String
}))
module.exports = Models;
