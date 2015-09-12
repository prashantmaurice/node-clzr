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

    var GeoFencesSchema = mongoose.Schema({
        location : {type:[Number], index:'2dsphere'},
        radius : Number,
        type : Number,
        params : Schema.Types.Mixed,
        vendors : [ObjectId]
    });
    GeoFencesSchema.index({ location : '2d' });

    GeoFencesSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    return GeoFencesSchema;
};
