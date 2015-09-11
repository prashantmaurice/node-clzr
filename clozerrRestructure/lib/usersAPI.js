/**
 * Created by devesh on 21/07/15.
 */
'use strict';
var deferred = require('../common-utils/deferred');
var fn = require('../common-utils/functions');

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


UsersAPI.prototype.testUser = function(params) {
    return apiResponse(true,{ data : "Users API working"});
};


module.exports = UsersAPI;




