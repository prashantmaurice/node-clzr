/**
 * Created by maurice on 11/09/15.
 */

var mongoose = require('mongoose');
var dbConfig = require('config').mongodbConfig;
var underscore = require('underscore');

var dbUrl = 'mongodb://' + dbConfig.host + '/' + dbConfig.database;

var options = {
    user: dbConfig.username,
    pass: dbConfig.password
};
console.log('Connecting to DataBase: ', dbUrl, options);

mongoose.connect(dbUrl, options, function(err){
    if(err) console.logger.error("MONGO ERROR:",err);
});

mongoose.connection.on('error', function(err) {
    console.logger.error("MONGO ERROR1:",err);
});


//Entity Models
var tags_repo = require('./mongo/tags_repo')(mongoose);
var datas_repo = require('./mongo/datas_repo')(mongoose);
var users_repo = require('./mongo/users_repo')(mongoose);
var tokens_repo = require('./mongo/tokens_repo')(mongoose);
var offers_repo = require('./mongo/offers_repo')(mongoose);
var vendors_repo = require('./mongo/vendors_repo')(mongoose);
var reviews_repo = require('./mongo/reviews_repo')(mongoose);
var contents_repo = require('./mongo/contents_repo')(mongoose);
var checkins_repo = require('./mongo/checkins_repo')(mongoose);
var geofences_repo = require('./mongo/geofences_repo')(mongoose);
var analytics_repo = require('./mongo/analytics_repo')(mongoose);
var feedbacks_repo = require('./mongo/feedbacks_repo')(mongoose);
var databundles_repo = require('./mongo/databundles_repo')(mongoose);
var notifications_repo = require('./mongo/notifications_repo')(mongoose);
var vendor_requests_repo = require('./mongo/vendor_requests_repo')(mongoose);


//Define all Collections names here, note : mongoose is smart and adds 's' at the end of collection name
TagModel = mongoose.model('tag', tags_repo);
UsersModel = mongoose.model('user', users_repo);
TokenModel = mongoose.model('token', tokens_repo);
OfferModel = mongoose.model('offer', offers_repo);
DataModel = mongoose.model('datamodel', datas_repo);
ReviewModel = mongoose.model('review', reviews_repo);
VendorsModel = mongoose.model('vendor', vendors_repo);
CheckinModel = mongoose.model('checkin', checkins_repo);
ContentModel = mongoose.model('content', contents_repo);
FeedbackModel = mongoose.model('feedback', feedbacks_repo);
GeoFencesModel = mongoose.model('geofence', geofences_repo);
AnalyticsModel = mongoose.model('analytic', analytics_repo);
DataBundleModel = mongoose.model('databundle', databundles_repo);
NotificationModel = mongoose.model('notification', notifications_repo);
VendorRequestModel = mongoose.model('vendorrequest', vendor_requests_repo);

exports.Tags = TagModel;
exports.Data = DataModel;
exports.Users = UsersModel;
exports.Offers = OfferModel;
exports.Tokens = TokenModel;
exports.Reviews = ReviewModel;
exports.Vendors = VendorsModel;
exports.Checkins = CheckinModel;
exports.Contents = ContentModel;
exports.Feedbacks = FeedbackModel;
exports.Analytics = AnalyticsModel;
exports.GeoFences = GeoFencesModel;
exports.DataBundles = DataBundleModel;
exports.Notifications = NotificationModel;
exports.VendorRequests = VendorRequestModel;
