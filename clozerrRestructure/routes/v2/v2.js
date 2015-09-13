/**
 *  This is the main V2 router,
 *  These APIs are documented as of Sept 12th by maurice
 *  Attach your sub-apps to this router
 *
 */


var express = require('express');
var admin = express();

admin.on('mount', function (parent) {
    console.log('v2 API router Mounted');
});

admin.get('/', function (req, res) {
    res.send({status : 'v2 apis are working seamlessly.......!'});
});
admin.use('/user', require('./users'));
admin.use('/vendor', require('./vendors'));
admin.use('/auth', require('./auth'));

module.exports = admin;

