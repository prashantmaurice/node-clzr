/**
 *
 * This is the main Users Table,
 *
 * NOTE :   If you are doing any schema changes, see all the affected API calls
 *          and make them backward compatible
 *
 */

module.exports =  function(mongoose){
    var UsersSchema = mongoose.Schema({

        social_id:String,   // Social ID in case auth-type references external ID provider.
        type:String,    // Type of user.. possible types are "User", "Vendor", "Admin" & "TestUser".
        vendor_id:String,   // In case type="Vendor", ref to vendor.

        stamplist: mongoose.Schema.Types.Mixed,  // Record stamps at each vendor.

        username:String,    // For auth-type = "password"
        password:String,    // Password is SHA256 hashed with secret key stored in the settings.

        auth_type:String,   // Identity source.
        profile: mongoose.Schema.Types.Mixed, // Record profile data obtained from Identity Provider.

        date_created:Date,

        dateLastLogin:Date,
        dateLastLogout:Date,

        upgraded:Date,  // Record Switch to v2 or above.
        gcm_id: String,  // Record latest GCM ID.

        favourites:mongoose.Schema.Types.Mixed, // Record favourite vendors.
        pinned:mongoose.Schema.Types.Mixed, // Record pinned offers.

        stateList: mongoose.Schema.Types.Mixed,// ?
        lucky_rewards: mongoose.Schema.Types.Mixed, // ???
        failed_instances: mongoose.Schema.Types.Mixed,// ???

        rewards : mongoose.Schema.Types.Mixed,
        notifications: mongoose.Schema.Types.Mixed,

        computed: mongoose.Schema.Types.Mixed, // Impulse Scope data.

        offers_used : [mongoose.Schema.ObjectId],
        alias_of: mongoose.Schema.ObjectId	//  Holds a reference to the main object if any.

    });

    UsersSchema.statics.readAllD = function (data, cb) {
        var limit = data.limit || 30;
        this.find({}).limit(limit).lean().exec(cb);
    };

    UsersSchema.statics.readUserOfID = function (data, cb) {
        var userId = data.id;
        this.findOne({_id : userId}).lean().exec(cb);
    };

    UsersSchema.statics.readUserOfEmail = function (data, cb) {
        var email = data.email;
        this.findOne({"profile.email" : email}).lean().exec(cb);
    };

    UsersSchema.statics.createNewUser = function (data, cb) {
        var upgraded = new Date();
        var email = data.email;
        var name = data.name;
        var picture = data.picture;
        var socialId = data.socialId;
        var raw = data.rawProfileData;
        var auth_type = data.auth_type;
        var gender = data.gender;
        this.create({
            auth_type : auth_type,
            upgraded : upgraded,
            profile : {
                id : socialId,
                picture : picture,
                name : name,
                email : email,
                raw : raw,
                gender : gender
            },
            favourites : [],
            pinned : [],
            computed : [],
            rewards : []
        },cb);
    };

    UsersSchema.statics.updateGcmIdForUser = function (data, cb) {
        var userId = data.id;
        var gcmId = data.gcmId;
        this.update({_id: userId}, {gcm_id:gcmId}, {upsert: false}).lean().exec(cb);
//        this.find({_id : userId}).lean().exec(cb);
    };

    return UsersSchema;
};