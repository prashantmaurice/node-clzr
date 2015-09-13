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
        var googleUserData = JSON.parse(response.result);
        if(googleUserData.error){
            //Wrong token credentials
            return apiResponse(false,googleUserData.error.message,error.code.INVALID_GOOGLE_TOKEN);
        }else{
            //Extract from google api result
            var socialId = googleUserData.id;
            var email = googleUserData.email;
            var name = googleUserData.name;
            var picture = googleUserData.picture;
            var gender = googleUserData.gender;

            return fn.defer(fn.bind(repos.usersRepo, 'readUserOfEmail'))({ email : email}).pipe(function(userData){
                function sendData(access_token, userId, name,picture){
                    return apiResponseDeprecated(true,{
                        result   : true,
                        token : access_token,
                        user : {
                            _id : userId,
                            profile : {
                                name : name,
                                picture : picture
                            }
                        }
                    });
                }
                if(!userData){
                    //New user
                    console.log("User with email "+email+" does not exist, hence creating one");
                    return fn.defer(fn.bind(repos.usersRepo, 'createNewUser'))({
                        email : data.email,
                        name : name,
                        picture : picture,
                        socialId : socialId,
                        raw : email,
                        gender : gender, //TODO : add enum here
                        auth_type : "google" //TODO : add enum here
                    }).pipe(function(userCreateData){
                        //Generate fresh clozerr token
                        console.log("userCreateData ",userCreateData);
                        console.log("Creating new CLozerr token for user : "+userCreateData._id);
                        var access_token = hat();
                        return fn.defer(fn.bind(repos.tokensRepo, 'addTokenD'))({userId : userData._id, access_token:access_token }).pipe(function(data){
                            return sendData(access_token,userCreateData._id,name,picture);
                        });
                    });

                }else{
                    //Already existing user
                    return fn.defer(fn.bind(repos.tokensRepo, 'getTokenForUserD'))({ userId : userData._id }).pipe(function(tokenData){
                        if(!tokenData){
                            //Generate fresh clozerr token
                            console.log("Creating new CLozerr token for user : "+userData._id);
                            var access_token = hat();
                            return fn.defer(fn.bind(repos.tokensRepo, 'addTokenD'))({userId : userData._id, access_token:access_token }).pipe(function(tokenCreateData){
                                return sendData(access_token,userData._id,userData.profile.name,userData.profile.picture);
                            });
                        }else{
                            console.log("Sending already existing CLozerr token for user : "+userData._id);
                            return sendData(tokenData.access_token,userData._id,userData.profile.name,userData.profile.picture);
                        }
                    });
                }
            });
        }
    });

//    return fn.defer(fn.bind(repos.usersRepo, 'readAllD'))({ limit : 30}).pipe(function(data){
//        return apiResponse(true,data);
//    });
};

AuthAPI.prototype.loginWithFacebookToken = function(params) {
    var token = params.token;
    console.log("Trying to Login with Facebook token : "+token);
    var url = "https://graph.facebook.com/me/?access_token="  + token;
    console.log("calling : "+url);
    var self = this;
    return self.httpClient.getJSON(url,{}).pipe(function(response) {
        var fbUserData = JSON.parse(response.result);
        if(fbUserData.error){
            //Wrong token credentials
            return apiResponse(false,fbUserData.error.message,error.code.INVALID_GOOGLE_TOKEN);
        }else{
            //Extract from facebook api result
            var socialId = fbUserData.id;
            var email = fbUserData.email;
            var name = fbUserData.name;
            var picture = fbUserData.picture;
            var gender = fbUserData.gender;

            return fn.defer(fn.bind(repos.usersRepo, 'readUserOfEmail'))({ email : email}).pipe(function(userData){
                function sendData(access_token, userId, name,picture){
                    return apiResponseDeprecated(true,{
                        result   : true,
                        token : access_token,
                        user : {
                            _id : userId,
                            profile : {
                                name : name,
                                picture : picture
                            }
                        }
                    });
                }
                if(!userData){
                    //New user
                    console.log("User with email "+email+" does not exist, hence creating one");
                    return fn.defer(fn.bind(repos.usersRepo, 'createNewUser'))({
                        email : data.email,
                        name : name,
                        picture : picture,
                        socialId : socialId,
                        raw : email,
                        gender : gender, //TODO : add enum here
                        auth_type : "google" //TODO : add enum here
                    }).pipe(function(userCreateData){
                        //Generate fresh clozerr token
                        console.log("userCreateData ",userCreateData);
                        console.log("Creating new CLozerr token for user : "+userCreateData._id);
                        var access_token = hat();
                        return fn.defer(fn.bind(repos.tokensRepo, 'addTokenD'))({userId : userData._id, access_token:access_token }).pipe(function(data){
                            return sendData(access_token,userCreateData._id,name,picture);
                        });
                    });

                }else{
                    //Already existing user
                    return fn.defer(fn.bind(repos.tokensRepo, 'getTokenForUserD'))({ userId : userData._id }).pipe(function(tokenData){
                        if(!tokenData){
                            //Generate fresh clozerr token
                            console.log("Creating new CLozerr token for user : "+userData._id);
                            var access_token = hat();
                            return fn.defer(fn.bind(repos.tokensRepo, 'addTokenD'))({userId : userData._id, access_token:access_token }).pipe(function(tokenCreateData){
                                return sendData(access_token,userData._id,userData.profile.name,userData.profile.picture);
                            });
                        }else{
                            console.log("Sending already existing CLozerr token for user : "+userData._id);
                            return sendData(tokenData.access_token,userData._id,userData.profile.name,userData.profile.picture);
                        }
                    });
                }
            });
        }
    });

//    return fn.defer(fn.bind(repos.usersRepo, 'readAllD'))({ limit : 30}).pipe(function(data){
//        return apiResponse(true,data);
//    });
};


AuthAPI.prototype.updateGCMId = function(params) {
    var access_token = params.access_token;
    var gcm_id = params.gcm_id;
    return getUserForAccessToken(access_token).pipe(function(userData){
        if(!userData) return apiResponse(false,"Invalid access token : "+access_token);
        return fn.defer(fn.bind(repos.usersRepo, 'updateGcmIdForUser'))({ id : userData._id, gcmId : gcm_id}).pipe(function(data){
            return apiResponse(true,{ status : "success", new_gcm_id : gcm_id});
        });
    });
};

//Helper functions
function getUserForAccessToken(access_token){
    return fn.defer(fn.bind(repos.tokensRepo, 'getUserForTokenD'))({ access_token : access_token}).pipe(function(tokenData){
        if(!tokenData) return deferred.success(null);
        console.log("Token Validation success, token : "+access_token+" & userId : "+tokenData.account.toString());
        return fn.defer(fn.bind(repos.usersRepo, 'readUserOfID'))({ id : tokenData.account}).pipe(function(userData){
            if(!userData) return deferred.success(null);
            console.log("Found user for token : "+access_token+" & name : "+((userData.profile.name)?userData.profile.name:""));
            return deferred.success(userData);
        });
    });
}


module.exports = AuthAPI;




