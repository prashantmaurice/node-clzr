var express = require('express');
var router = express.Router();
var _ = require('underscore');
var deferred = require('../../common-utils/deferred');
var fn = require('../../common-utils/functions');
var vendorsAPI = new (require('../../lib/vendorsAPI.js'))();

/**
 * Routes Pending :
 *      http://api.clozerr.com/v2/vendor/offers/rewardspage?version=2.3.2&access_token=
 *      http://api.clozerr.com/v2/vendor/get/details?vendor_id=55f411c0b9a5ccd57400d84b
 *      http://api.clozerr.com/v2/vendor/offers/offerspage?access_token=2c2c7e0dd81940ce2ed4116b4556bce7&vendor_id=55f411c0b9a5ccd57400d84b
 *      http://api.clozerr.com/v2/vendor/offers/unlocked?access_token=2c2c7e0dd81940ce2ed4116b4556bce7&vendor_id=55f411c0b9a5ccd57400d84b
 *      http://api.clozerr.com/v2/vendor/offers/checkin?version=2.3.2&offer_id=55f41303b9a5ccd57400d85a&vendor_id=55f411c0b9a5ccd57400d84b&gcm_id=%7CID%7C1%7C%3AccbTvPFCNPE%3AAPA91bHv3ODSqNcb-vYWd743kwEXBMGyrDE60KmiJBfTl89TCm3niaUakc5hixUb7BjLBPtMQv6_rBMjN4fxIhod7ROCwNCjx2-ng8keVreBQbhP_UiwSv33sJUCMrt_qgALmm0Qat7t&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 *
 *
 * @param req
 * @param res
 * @param apiMethod
 */

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
    callAPI(req, res, fn.bind(vendorsAPI, 'getAllVendors'));
});

/**
 *  Serves requests from homepage of the app
 *
 *  sample request : http://localhost:3001/v2/vendor/search/near?version=2.3.2&latitude=12.0366742&longitude=70.2516742999&offset=0&access_token=2c2c7e0dd81940ce2ed4116b4556bce7&limit=7
 *  sample response : [
     {
        _id: "55a66b03eb4fe2692ca07c86",
        name: "Freeing India",
        location: [13.0552915,80.24983529999997],
        distance: 2.797,
        image: "http://s3-ap-southeast-1.amazonaws.com/clozerr/app/coupons-alpha/",
        image_base: "https://s3-ap-southeast-1.amazonaws.com/clozerr/app/coupons-alpha/",
        gallery: [ ],
        address: "Ispahani Centre, 123, Nungambakkam High Road, Nungambakkam, Chennai, Tamil Nadu 600034, India",
        resource_name: "freeing india",
        caption: "2.797 km",
        active: true,
        geofences: ["55e8a70194a8f4403aaed146"],
        favourite: false
    }
 ]
 *
 */
router.get('/search/near', function(req, res, next) {
    callAPI(req, res, fn.bind(vendorsAPI, 'searchNear'));
});




module.exports = router;
