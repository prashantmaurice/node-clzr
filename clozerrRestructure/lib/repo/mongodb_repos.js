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

UsersModel = mongoose.model('user', users_repo);
VendorsModel = mongoose.model('vendor', vendors_repo);


exports.Users = UsersModel;
exports.Vendors = VendorsModel;
