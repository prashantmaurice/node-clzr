var express = require('express');
var admin = express();

admin.on('mount', function (parent) {
    console.log('v2 API router Mounted');
});

admin.get('/', function (req, res) {
    res.send({status : 'v2 apis are working seamlessly.......!'});
});
admin.use('/users', require('./users'));
admin.use('/vendors', require('./vendors'));

module.exports = admin;

