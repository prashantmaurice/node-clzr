/**
 *
 * This is the main Tokens Repo,
 *
 * NOTE :   If you are doing any schema changes, see all the affected API calls
 *          and make them backward compatible
 *
 */

module.exports =  function(mongoose){
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.ObjectId;

    var TokensSchema = mongoose.Schema({
        access_token:String,
        account:ObjectId
    });

    TokensSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    return TokensSchema;
};
