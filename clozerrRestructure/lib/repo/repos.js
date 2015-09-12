/**
 *      Contains all the data repos that we are using (can be either serving from mongoDb or mySQL)
 */

var usersRepo = require('./mongodb_repos.js').Users;


var Repos = {
    usersRepo                   :   usersRepo
};

module.exports = Repos;
