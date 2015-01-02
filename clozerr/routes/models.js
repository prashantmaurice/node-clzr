var Models = {};

Models.Vendor = mongoose.model('Vendor',{
	
	location : {type:[Number],index:'2dsphere'} ,
	name:String,
	offers : [String],
	image : String,
	offers_old : [String],
	fid:String,
	dateCreated:Date

});

Models.User = mongoose.model('User',new Schema({
    name:String,
    fb_id:Number
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

modules.exports = Models;
