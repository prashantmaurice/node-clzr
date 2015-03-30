var express = require('express');
var router = express.Router();

var googleapis = require('googleapis'),
    JWT = googleapis.auth.JWT,
    analytics = googleapis.analytics('v3');

var SERVICE_ACCOUNT_EMAIL = '949914951457-mn2dh2ei7on066pt9chkm5lmpsdkd80k@developer.gserviceaccount.com';
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key.pem';


var authClient = new JWT(
    SERVICE_ACCOUNT_EMAIL,
    SERVICE_ACCOUNT_KEY_FILE,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
);
router.get('/',function(req,res){
    var metrics="",dimensions="",startdate="",enddate="",filter="";
    if(req.query.metrics) metrics=req.query.metrics;
    if(req.query.dimensions) dimensions=req.query.dimensions;
    if(req.query.startdate) startdate=req.query.startdate;
    if(req.query.enddate) enddate=req.query.enddate;
    if(req.query.filter) filter=req.query.filter;
    authClient.authorize(function(err, tokens) {
        if (err) {
            console.log(err);
            return;
        }
        analytics.data.ga.get({
            auth: authClient,
            'ids': 'ga:97645326',
            'start-date': startdate,
            'end-date': enddate,
            'metrics': metrics,
            'filters': filter,
            'dimensions': dimensions
        }, function(err, result) {
            if(err) console.log(err);
            res.end(JSON.stringify(result));
        });
    });
});

module.exports=router;
