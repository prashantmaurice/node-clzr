/**
 *      Documented by Maurice :
 *
 *      This contains all the logic of the different API calls. Use the routes folder only for routing towards different modules
 *      like this. Keep DB structure out of this module and put them in a module under repos so that DB schema change wont affect
 *      this module
 *
 *      This is Login API, which handles all logic related to Login and Sessions of Mobile Users
 */

'use strict';
var deferred = require('../common-utils/deferred');
var fn = require('../common-utils/functions');
var repos = require('./repo/repos.js');

//var repos = require('./repo/repos.js');
var moment = require('moment');

function apiResponse(success, result) {
    if (success) {
        return deferred.success({
            status: 'success',
            message: null,
            result: result
        });
    } else {
        return deferred.success({
            status: 'error',
            message: result,
            result: null
        });
    }
}


function UsersAPI() {}


UsersAPI.prototype.getAllUsers = function(params) {
    return fn.defer(fn.bind(repos.usersRepo, 'readAllD'))({ limit : 30}).pipe(function(data){
        return apiResponse(true,data);
    });
};


module.exports = UsersAPI;




