var express = require('express');
var router = express.Router();
var _ = require('underscore');
var deferred = require('../../common-utils/deferred');
var fn = require('../../common-utils/functions');
var authAPI = new (require('../../lib/authAPI.js'))();

function callAPI(req, res, apiMethod) {

    var params = {};
    if (req.method.toLowerCase() === 'get') { params = _.extend(req.params, req.query); params.post = {} }
    if (req.method.toLowerCase() === 'post') { params = _.extend(req.params, req.query); params.post = req.body; }
    if (req.method.toLowerCase() === 'put') { params = _.extend(req.params, req.query); params.post = req.body; }
    if (req.method.toLowerCase() === 'delete') { params = _.extend(req.params, req.query); params.post = req.body; }

    apiMethod(params)
        .success(function (result) {
            var statusCode =  (result.statusCode)?result.statusCode:200;
            res.status(statusCode).send(result);
        })
        .failure(function (error) {
            var statusCode =  (error.statusCode)?error.statusCode:500;
            console.logger.error(error);
            res.status(statusCode).send(error);
        });

}



/* GET users listing. */
//router.get('/', function(req, res, next) {
//    callAPI(req, res, fn.bind(usersAPI, 'getAllUsers'));
//});


/**
 *  User trying to login with google/facebook access_token, to get his userId, username, picurl, access_token(clozerr-server's)
 *
 *  sample request : http://api.clozerr.com/v2/auth/login/google?token=ya29.7QE0vp4i1K2IfLTXr2VG5gha-qWQlV_cRXX_4nYG8SqPLXZ0A9Kx4s9rDo6tvVpugFTXyA
 *  sample response :
 {
    result: true,
    token: "7ba7296781c5b1040fa00eaa125a10d3",
    user: {
        _id: "54ddfc1d5500776b146a27d1",
        profile: {
            name: "Prashant Maurice",
            picture: "https://lh4.googleusercontent.com/-T-2uyM8lKyI/AAAAAAAAAAI/AAAAAAAAB_U/IWmXmmYWDJY/photo.jpg?sz=50"
        }
    },
    statusCode: 200
}
 *
 */
router.get('/login/google', function(req, res, next) {
    callAPI(req, res, fn.bind(authAPI, 'loginWithGoogleToken'));
});
router.get('/login/facebook', function(req, res, next) {
    callAPI(req, res, fn.bind(authAPI, 'loginWithFacebookToken'));
});



router.all('/', function (req, res) {
    res.send('Unhandled request');
});

module.exports = router;
