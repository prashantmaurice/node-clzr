/**
 *
 * This is the main Vendors Table,
 *
 * NOTE :   If you are doing any schema changes, see all the affected API calls
 *          and make them backward compatible
 *
 */

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

    return VendorsSchema;
};
