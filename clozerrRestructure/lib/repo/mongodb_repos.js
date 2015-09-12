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
var users_repo = require('./mongo/users_repo')(mongoose);
var vendors_repo = require('./mongo/vendors_repo')(mongoose);
var geofences_repo = require('./mongo/geofences_repo')(mongoose);
var checkins_repo = require('./mongo/checkins_repo')(mongoose);
var contents_repo = require('./mongo/contents_repo')(mongoose);
var notifications_repo = require('./mongo/notifications_repo')(mongoose);
var feedbacks_repo = require('./mongo/feedbacks_repo')(mongoose);
var offers_repo = require('./mongo/offers_repo')(mongoose);
var reviews_repo = require('./mongo/reviews_repo')(mongoose);
var tokens_repo = require('./mongo/tokens_repo')(mongoose);
var vendor_requests_repo = require('./mongo/vendor_requests_repo')(mongoose);

UsersModel = mongoose.model('user', users_repo);
VendorsModel = mongoose.model('vendor', vendors_repo);
GeoFencesModel = mongoose.model('geofence', geofences_repo);
CheckinModel = mongoose.model('checkin', checkins_repo);
ContentModel = mongoose.model('content', contents_repo);
NotificationModel = mongoose.model('notification', notifications_repo);
FeedbackModel = mongoose.model('notification', feedbacks_repo);
OfferModel = mongoose.model('notification', offers_repo);
ReviewModel = mongoose.model('notification', reviews_repo);
TokenModel = mongoose.model('notification', tokens_repo);
VendorRequestModel = mongoose.model('notification', vendor_requests_repo);


exports.Users = UsersModel;
exports.Vendors = VendorsModel;
exports.GeoFences = GeoFencesModel;
exports.Checkins = CheckinModel;
exports.Contents = ContentModel;
exports.Notifications = NotificationModel;
exports.Feedbacks = FeedbackModel;
exports.Offers = OfferModel;
exports.Reviews = ReviewModel;
exports.Tokens = TokenModel;
exports.VendorRequests = VendorRequestModel;
