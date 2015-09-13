/**
 *
 * This is the main Vendors Table,
 *
 * NOTE :   If you are doing any schema changes, see all the affected API calls
 *          and make them backward compatible
 *
 */

var dataRelatedSettings = require('config').dataRelatedSettings;

module.exports =  function(mongoose){
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.ObjectId;

    var VendorsSchema = mongoose.Schema({
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
    VendorsSchema.index({ location: '2d' });

    VendorsSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    VendorsSchema.statics.nearByVendorsD = function (params, cb) {
        var limit = params.limit || 30;
        var offset = params.offset || 0;
        var longg = params.longg || dataRelatedSettings.defaultSearchLatLong.longg;
        var lat = params.lat || dataRelatedSettings.defaultSearchLatLong.lat;
        var whereParam = (params.active!=null)?{ visible : params.active } : {};

        //TODO : add max Radius Support
        var radius = params.radius ? Number(params.radius) : 10000000; //in Meters

        this.find({ location: { $near :  [ lat, longg ] }})
        .where(whereParam)
        .skip(offset).limit(limit).exec(cb);

    };

    VendorsSchema.statics.readVendorOfParams = function (params, cb) {
        var paramsObj = {};
        if(params.id) paramsObj._id =  params.id;
        this.findOne(paramsObj).exec(cb);
    };

    VendorsSchema.statics.readVendorsOfIds = function (params, cb) {
        var idsArr =  params.vendorIds;
        this.find({ _id: { $in :  idsArr }}).exec(cb);
    };

    return VendorsSchema;
};
