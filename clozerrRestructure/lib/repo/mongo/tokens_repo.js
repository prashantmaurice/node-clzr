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
        account : ObjectId
    });

    TokensSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    TokensSchema.statics.getUserForTokenD = function (data, cb) {
        var access_token = data.access_token;
        this.find({access_token : access_token}).lean().exec(cb);
    };

    TokensSchema.statics.getTokenForUserD = function (data, cb) {
        var id = data.userId;
        this.findOne({account : mongoose.Types.ObjectId(id)}).lean().exec(cb);
    };

    TokensSchema.statics.addTokenD = function (data, cb) {
        var account = mongoose.Types.ObjectId(data.userId);
        var access_token = data.access_token;
        this.create({account : account, access_token:access_token },cb);
    };

    return TokensSchema;
};
