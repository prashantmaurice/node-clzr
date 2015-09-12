var express = require('express');
var router = express.Router();

var v2 = require('./v2');

var allRoutes = function (app) {
    /* GET home page. */
    app.use('/', express.Router().get('/', function (req, res, next) {
        res.render('index', { title: 'Express' });
    }));

    //All V2 routes
    app.use('/v2', v2);
};




module.exports = allRoutes;


/** ALL ROUTES THAT ARE BEING HIT ON LIVE DB
 *
 *  http://api.clozerr.com/v2/vendor/offers/rewardspage?version=2.3.2&access_token=
 *  http://api.clozerr.com/v2/user/favourites/list?version=2.3.2&access_token=
 *  http://api.clozerr.com/v2/analytics/hit?metric=Clozerr_Home_Screen&dimensions%5Bdevice%5D=Android%20API%2021&dimensions%5Bid%5D=a0a518b192b69d0d&time=2015-09-12T23%3A49Z&access_token=
 *  http://api.clozerr.com/v2/geofence/list/near?latitude=12.9368459&longitude=77.6286097
 *  http://api.clozerr.com/v2/vendor/search/near?version=2.3.2&latitude=12.93684595&longitude=77.62860971&offset=0&access_token=&limit=7
 *  http://api.clozerr.com/v2/auth/login/google?token=ya29.7AE0SDu3Od0rcr0RcgozY7JFC7kyKI9CqerMKCJgEQ1PeldZiydZFBrLaRjKrzbp6OUFuw
 *  http://api.clozerr.com/v2/user/favourites/list?version=2.3.2&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 *  http://api.clozerr.com/v2/vendor/offers/rewardspage?version=2.3.2&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 *  http://api.clozerr.com/v2/analytics/hit?metric=Clozerr_Home_Screen&dimensions%5Bdevice%5D=Android%20API%2021&dimensions%5Bid%5D=a0a518b192b69d0d&time=2015-09-12T23%3A53Z&access_token=2c2c7e0dd81940ce2ed4116b4556bce7&latitude=12.9368459&longitude=77.6286097
 *  http://api.clozerr.com/v2/vendor/search/near?version=2.3.2&latitude=12.93684595&longitude=77.62860971&offset=0&access_token=2c2c7e0dd81940ce2ed4116b4556bce7&limit=7
 *  http://api.clozerr.com/v2/vendor/get/details?vendor_id=55f411c0b9a5ccd57400d84b
 *  http://api.clozerr.com/v2/vendor/offers/offerspage?access_token=2c2c7e0dd81940ce2ed4116b4556bce7&vendor_id=55f411c0b9a5ccd57400d84b
 *  http://api.clozerr.com/v2/vendor/offers/unlocked?access_token=2c2c7e0dd81940ce2ed4116b4556bce7&vendor_id=55f411c0b9a5ccd57400d84b
 *  http://api.clozerr.com/v2/analytics/hit?metric=%20Vendor%20Screen&dimensions%5Bdevice%5D=Android%20API%2021&dimensions%5Bid%5D=a0a518b192b69d0d&time=2015-09-12T23%3A56Z&access_token=2c2c7e0dd81940ce2ed4116b4556bce7&latitude=12.9368459&longitude=77.6286097
 *  http://api.clozerr.com/v2/analytics/hit?metric=Vendor%20Screen&dimensions%5Bdevice%5D=Android%20API%2021&dimensions%5Bid%5D=a0a518b192b69d0d&time=2015-09-12T23%3A56Z&access_token=2c2c7e0dd81940ce2ed4116b4556bce7&latitude=12.9368459&longitude=77.6286097&dimensions%5Bvendor%5D=55f411c0b9a5ccd57400d84b
 *  http://api.clozerr.com/v2/vendor/offers/rewardspage?version=2.3.2&vendor_id=55f411c0b9a5ccd57400d84b&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 *  http://api.clozerr.com/v2/vendor/offers/offerspage?version=2.3.2&vendor_id=55f411c0b9a5ccd57400d84b&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 *  http://api.clozerr.com/v2/vendor/offers/unlocked?version=2.3.2&vendor_id=55f411c0b9a5ccd57400d84b&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 *  http://api.clozerr.com/v2/vendor/offers/checkin?version=2.3.2&offer_id=55f41303b9a5ccd57400d85a&vendor_id=55f411c0b9a5ccd57400d84b&gcm_id=%7CID%7C1%7C%3AccbTvPFCNPE%3AAPA91bHv3ODSqNcb-vYWd743kwEXBMGyrDE60KmiJBfTl89TCm3niaUakc5hixUb7BjLBPtMQv6_rBMjN4fxIhod7ROCwNCjx2-ng8keVreBQbhP_UiwSv33sJUCMrt_qgALmm0Qat7t&access_token=2c2c7e0dd81940ce2ed4116b4556bce7
 */