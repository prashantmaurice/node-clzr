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
var error = require('../common-utils/error');
var repos = require('./repo/repos.js');
var hat = require('hat');
var basicHttpClient = require('./clients/httpclient.js').getInstance();

//var repos = require('./repo/repos.js');
var moment = require('moment');

function apiResponse(success, result, statusCode) {
    if (success) {
        return deferred.success({
            statusCode : statusCode,
            status: 'success',
            message: null,
            result: result
        });
    } else {
        return deferred.success({
            statusCode : statusCode,
            status: 'error',
            message: result,
            result: null
        });
    }
}
function apiResponseDeprecated(success,data){
    data.statusCode = (success)?200:500;
    return deferred.success(data,200);
}


function AuthAPI() {
    this.httpClient = basicHttpClient;
}


AuthAPI.prototype.loginWithGoogleToken = function(params) {
    var token = params.token;
    console.log("Trying to Login with Google token : "+token);
    var url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token;
    console.log("calling : "+url);
    var self = this;
    return self.httpClient.getJSON(url,{}).pipe(function(response) {
        var result = JSON.parse(response.result);
        if(result.error){
            //Wrong token credentials
            return apiResponse(false,result.error.message,error.code.INVALID_GOOGLE_TOKEN);
        }else{
            //Extract from google api result
            var userId = result.id;
            var email = result.email;
            var name = result.name;
            var picture = result.picture;
            var gender = result.gender;

            return fn.defer(fn.bind(repos.usersRepo, 'readUserOfEmail'))({ email : email}).pipe(function(userData){
                if(!userData) return apiResponse(false,"User with this email does not exists");
                return fn.defer(fn.bind(repos.tokensRepo, 'getTokenForUserD'))({ userId : userData._id }).pipe(function(tokenData){
                    function sendData(access_token){
                        return apiResponseDeprecated(true,{
                            result   : true,
                            token : access_token,
                            user : {
                                _id : userData._id,
                                profile : {
                                    name : userData.profile.name,
                                    picture : userData.profile.picture
                                }
                            }
                        });
                    };


                    if(!tokenData){
                        //Generate fresh clozerr token
                        console.log("Creating new CLozerr token for user : "+userData._id);
                        var access_token = hat();
                        return fn.defer(fn.bind(repos.tokensRepo, 'addTokenD'))({userId : userData._id, access_token:access_token }).pipe(function(data){
                            return sendData(access_token);
                        });
                    }else{
                        console.log("Sending already existing CLozerr token for user : "+userData._id);
                        return sendData(tokenData.access_token);
                    }

                });
            });
        }
    });

//    return fn.defer(fn.bind(repos.usersRepo, 'readAllD'))({ limit : 30}).pipe(function(data){
//        return apiResponse(true,data);
//    });
};


module.exports = AuthAPI;




