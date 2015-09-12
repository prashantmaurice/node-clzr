/**
 *      Contains all the data repos that we are using (can be either serving from mongoDb or mySQL)
 */

var usersRepo = require('./mongodb_repos.js').Users;
var vendorsRepo = require('./mongodb_repos.js').Vendors;


var Repos = {
    usersRepo                   :   usersRepo,
    vendorsRepo                 :   vendorsRepo
};

module.exports = Repos;
