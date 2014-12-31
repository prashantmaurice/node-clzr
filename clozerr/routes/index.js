var express = require('express');
var router = express.Router();
var settings = require('./settings');
/* GET home page. */
var https = require('https');


router.get('/login', function(req, res) {
  res.render('index', { title: 'Express' });
  var options = {
  hostname: 'https://graph.facebook.com',
  port: 443,
  path: '/debug_token?input_token='+req.query.input_token+'&access_token=643340145745435|nyelclS2lAU75ksOpYtfOLNtwOg',
  method: 'GET'
};

var req = https.request(options, function(res) {
  console.log("Statuscode: ", res.statusCode);
  console.log("headers: ", res.headers);

  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});
  if(options.is_valid=='true')
  {
  	db.collections.find({facebook_user_id:options.user_id});
  }
});

module.exports = router;
