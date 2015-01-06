var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var models = require("./routes/models");
var Token = models.Token;
var User = models.User;

var auth = require('./routes/user');
var offer = require('./routes/offer');
var vendor = require('./routes/vendor');
var checkin = require('./routes/checkin');
var content = require('./routes/content');
var settings = require('./routes/settings');

var error = require('./routes/error');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function( req, res, next ){
  res.setHeader("Content-Type", "application/JSON");
  if( req.query.access_token ){
    Token.findOne( { access_token: req.query.access_token }, function( err, data ){
      if( err ){
       error.err(res,"102");
       return;
     }
     if( !data ){
      error.err(res,"619");
      return;
    }
    debugger;
    User.findOne({ _id: data.account }, function( err, data ){
      if( err ){
        error.err(res,"102");
        return;
      }
      if( !data ){
        error.err(res,"646");
        return;
      }
      req.user = data;
      next();
    });

  });
  }
  else{
    // TODO: SUBSTITUTE req.user with a dummy user object with a blank stamplist.
    req.user = { _id:"0", id_type:"Anonymous", auth_type:"None", stamplist:{}, social_id:""  };
    next();
  }

});
app.use('/auth', auth);
app.use('/offer', offer);
app.use('/vendor', vendor);
app.use('/checkin', checkin);
app.use('/content',content);

// --------- DB ----------
var db=mongoose.connection;
db.open('mongodb://'+settings.db.mongo.host+'/'+settings.db.mongo.name);
// --------- DB ----------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.end(JSON.stringify({ result:false, err:{ code:404, description:"Not found"} }));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    throw err;
    res.status(err.status || 500);
    res.end( JSON.stringify({
      message: err.message,
      error: err
    }));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  throw err;
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
