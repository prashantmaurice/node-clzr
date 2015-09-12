/**
 *
 * This is the main Checkin Repo,
 *
 * NOTE :   If you are doing any schema changes, see all the affected API calls
 *          and make them backward compatible
 *
 */

module.exports =  function(mongoose){
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.ObjectId;

    var CheckinsSchema = mongoose.Schema({
        user:ObjectId,
        vendor:ObjectId,
        offer:ObjectId,
        state:Number,
        date_created:Date,
        pin:String,
        gcm_id:String,
        validate_data:Schema.Types.Mixed,
        expiry:Date
    });

    CheckinsSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    return CheckinsSchema;
};
