var mongoose=require('mongoose');
var models = require("./routes/models");
var fs=require('fs');
var crypto = require('crypto');
var settings = require('./routes/settings');
var db=mongoose.connection;
var User = models.User;
var bcrypt = require("bcrypt-nodejs");

db.open('mongodb://db.clozerr.com/fin2');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync( "password", salt );

var admin1 = new User({
  username:"clozerradmin",
  password:hash,
  type:"Admin",
});

admin1.save();
