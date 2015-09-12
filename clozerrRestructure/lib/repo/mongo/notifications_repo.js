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

    var NotificationsSchema = mongoose.Schema({
        type:String,
        data:Schema.Types.Mixed,
        timestamp:Date,
        active:Boolean
    });

    NotificationsSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    return NotificationsSchema;
};
