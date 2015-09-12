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

    var FeedbacksSchema = mongoose.Schema({
        user: ObjectId,
        params: Schema.Types.Mixed,		// Contains notification title & message and other data.
        request: Schema.Types.Mixed,
        response: Schema.Types.Mixed,
        extra: String,
        timestamp: Date
    });

    FeedbacksSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    return FeedbacksSchema;
};
