/**
 *
 * This is the main Offers Repo,
 *
 * NOTE :   If you are doing any schema changes, see all the affected API calls
 *          and make them backward compatible
 *
 */

module.exports =  function(mongoose){
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.ObjectId;

    var OffersSchema = mongoose.Schema({
        type:String,
        stamps:String,
        date_created:Date,
        caption:String,
        description:String,
        dateUpdated:Date,
        params: Schema.Types.Mixed,
        vendor: Schema.Types.Mixed,
        image: String
    });

    OffersSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    OffersSchema.statics.getOffersForIds = function (data, cb) {
        var ids = data.ids || [];
        this.find({ _id: { $in: ids } } ).lean().exec(cb);
    };

    return OffersSchema;
};
