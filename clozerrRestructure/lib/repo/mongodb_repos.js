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

UsersModel = mongoose.model('user', users_repo);
VendorsModel = mongoose.model('vendor', vendors_repo);
GeoFencesModel = mongoose.model('geofence', geofences_repo);
CheckinModel = mongoose.model('checkin', checkins_repo);
ContentModel = mongoose.model('content', contents_repo);
NotificationModel = mongoose.model('notification', notifications_repo);


exports.Users = UsersModel;
exports.Vendors = VendorsModel;
exports.GeoFences = GeoFencesModel;
exports.Checkins = CheckinModel;
exports.Contents = ContentModel;
exports.Notifications = NotificationModel;
