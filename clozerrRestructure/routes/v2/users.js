var express = require('express');
var router = express.Router();
var _ = require('underscore');
var deferred = require('../../common-utils/deferred');
var fn = require('../../common-utils/functions');
var usersAPI = new (require('../../lib/usersAPI.js'))();

function callAPI(req, res, apiMethod) {

    var params = {};
    if (req.method.toLowerCase() === 'get') { params = _.extend(req.params, req.query); params.post = {} }
    if (req.method.toLowerCase() === 'post') { params = _.extend(req.params, req.query); params.post = req.body; }
    if (req.method.toLowerCase() === 'put') { params = _.extend(req.params, req.query); params.post = req.body; }
    if (req.method.toLowerCase() === 'delete') { params = _.extend(req.params, req.query); params.post = req.body; }

    apiMethod(params)
        .success(function (result,statusCode) {
            if(!statusCode) statusCode = 200;
            res.status(statusCode).send(result);
        })
        .failure(function (error,statusCode) {
            if(!statusCode) statusCode = 500;
            console.logger.error(error);
            res.status(statusCode).send(error);
        });

}



/* GET users listing. */
router.get('/', function(req, res, next) {
    callAPI(req, res, fn.bind(usersAPI, 'getAllUsers'));
});


router.get('/favourites/list', function(req, res, next) {
    callAPI(req, res, fn.bind(usersAPI, 'getFavoutiteVendors'));
});

module.exports = router;
