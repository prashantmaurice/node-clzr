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
	campaigns : Schema.Types.Mixed,
	visitOfferId : ObjectId,
	category : String, 
	flags : [String], 
	trials:Number, // ?
	qrcodes:[String],
	gallery:[String],
	image_base:String,
	image_small:String,// ?
	tags:[Schema.Types.ObjectId],// ?
	club_members:Number,
	geoloc:Boolean,// ?
	last_post:Date,// ?
	last_tweet:Date,// ?
	geofences:[ObjectId],
	logo: String,
	fb:String,
	twitter:String,
	gplus:String,
	computed: Schema.Types.Mixed
});
vendorSchema.index({ location: '2d' });

var geofenceSchema = new Schema({
	location : {type:[Number], index:'2dsphere'},
	radius : Number,
	type : Number,
	params : Schema.Types.Mixed
});
geofenceSchema.index({ location : '2d' });

Models.Geofence = mongoose.model('Geofence', geofenceSchema);

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

Models.Notification = mongoose.model('Notification',new Schema({
    type:String,
	data:Schema.Types.Mixed,
	timestamp:Date,
    active:Boolean
} ));

Models.User = mongoose.model('User',new Schema({

	social_id:String,   // Social ID in case auth-type references external ID provider.
	type:String,    // Type of user.. possible types are "User", "Vendor", "Admin" & "TestUser".
	vendor_id:String,   // In case type="Vendor", ref to vendor.

	stamplist: Schema.Types.Mixed,  // Record stamps at each vendor.

    username:String,    // For auth-type = "password"
	password:String,    // Password is SHA256 hashed with secret key stored in the settings.

	auth_type:String,   // Identity source.
	profile: Schema.Types.Mixed, // Record profile data obtained from Identity Provider.
	
    date_created:Date,

	dateLastLogin:Date,
	dateLastLogout:Date,
	
    upgraded:Date,  // Record Switch to v2 or above.
	gcm_id: String,  // Record latest GCM ID.

	favourites:Schema.Types.Mixed, // Record favourite vendors.
	pinned:Schema.Types.Mixed, // Record pinned offers.

    stateList: Schema.Types.Mixed,// ?
    lucky_rewards:Schema.Types.Mixed, // ??? 
    failed_instances:Schema.Types.Mixed,// ???

    rewards : Schema.Types.Mixed,
    notifications: Schema.Types.Mixed,
	
    computed: Schema.Types.Mixed, // Impulse Scope data.
    
    offers_used : [ObjectId]
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
	params: Schema.Types.Mixed,
	vendor: Schema.Types.Mixed,
	image: String
}));

Models.Review = mongoose.model('Review',new Schema({
	checkinid:ObjectId,
	stars:[Number],
	date_created:Date,
	remarks: String,
	vendor_id: ObjectId
}));

Models.Data = mongoose.model('Data',new Schema({
    type:String,
    content: Schema.Types.Mixed
}));

Models.Analytics = mongoose.model('Analytics',new Schema({
    timeStamp:{type: Date , default: Date.now()},
    user:ObjectId,
    metric:String,
    dimensions:Schema.Types.Mixed,
    test:Boolean
}));

Models.Tag = mongoose.model('Tag',new Schema({
	name:String
}))

Models.DataBundle = mongoose.model('DataBundle', new Schema({
	data: Schema.Types.Mixed
}))

module.exports = Models;
