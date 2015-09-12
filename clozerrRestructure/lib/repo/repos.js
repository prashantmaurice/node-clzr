/**
 *      Contains all the data repos that we are using (can be either serving from mongoDb or mySQL)
 */

var usersRepo = require('./mongodb_repos.js').Users;
var vendorsRepo = require('./mongodb_repos.js').Vendors;
var geofencesRepo = require('./mongodb_repos.js').GeoFences;
var checkinsRepo = require('./mongodb_repos.js').Checkins;
var contentsRepo = require('./mongodb_repos.js').Contents;
var notificationsRepo = require('./mongodb_repos.js').Notifications;
var feedbacksRepo = require('./mongodb_repos.js').Feedbacks;
var offersRepo = require('./mongodb_repos.js').Offers;
var reviewsRepo = require('./mongodb_repos.js').Reviews;
var tokensRepo = require('./mongodb_repos.js').Tokens;
var vendorRequestsRepo = require('./mongodb_repos.js').VendorRequests;


var Repos = {
    usersRepo                   :   usersRepo,
    vendorsRepo                 :   vendorsRepo,
    geofencesRepo                 :   geofencesRepo,
    checkinsRepo                 :   checkinsRepo,
    contentsRepo                 :   contentsRepo,
    notificationsRepo                 :   notificationsRepo,
    feedbacksRepo                 :   feedbacksRepo,
    offersRepo                 :   offersRepo,
    reviewsRepo                 :   reviewsRepo,
    tokensRepo                 :   tokensRepo,
    vendorRequestsRepo                 :   vendorRequestsRepo

};

module.exports = Repos;
