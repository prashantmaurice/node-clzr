var express = require('express');
var hat=require('hat');
var settings = require('./settings');
var https = require('https');
var mongoose=require('mongoose');
var models = require("./models");
var error = require("./error");
var bcrypt = require("bcrypt-nodejs");

var router = express.Router();
var user = models.User;
var User = user;

function newUser( backend, id ) {
 var nuser=new user({
  auth_type: backend,
  social_id:id,
  stamplist:{},
  type:"user"
});
 return nuser;
}

function loadFacebookDetails( user, access_token ){
  https.get("https://graph.facebook.com/me/?access_token=" + access_token, function( response ){

      response.on("data", function( dat ){
        var obj = JSON.parse( dat.toString() );
        user.profile = obj;
        user.markModified("profile");
      });
  });
}

function loadGoogleDetails(){

}

var token = models.Token;

function newid( tok, acc ){
  var nuser_id = new token({
    access_token:tok,
    account:acc
  });
  return nuser_id;
}

function loginUser( user ){
  var id = hat();
  return newid( id, user ).save().exec();
}

router.get('/login/facebook', function(req, res) {
  /*
    TODO: check req parameters.
    */

    var request = https.get('https://graph.facebook.com/debug_token?input_token=' + req.query.token + '&access_token='+settings.auth.facebook.app_token, function(response) {
      debugger;
      console.log("Statuscode: ", response.statusCode);
      console.log("headers: ", response.headers);

      response.on('data', function(dat) {
    //process.stdout.write(d);
    debugger;
    d=JSON.parse(dat.toString());
    console.log(d);
    if( d.data && d.data.is_valid )
    {
    //db.collections.find({facebook_user_id:options.user_id});

    user.findOne({fb_id:d.data.user_id}, function(err, result) {
      if (err) { console.log("error:") }
        debugger;
      if (result)
      {
            //console.log(result._id);
            // res.send(result);
            var id = hat();
            console.log(id);

            newid( id, result._id ).save();
            //res.redirect('/users/profile/?acc_token='+id)
            res.end( JSON.stringify( {result : true, token : id } ) );
          }
          else
          {
            var nu = newUser( "facebook", d.data.user_id );
            nu.save();
            var id=hat();

            console.log(id);
            newid(id,nu._id).save();

            res.end( JSON.stringify( {result : true, token : id } ) );
          }
        });
  }else{
    error.err( res, "102" );
  }

});

});

//req.end();

request.on('error', function(e) {
  console.error(e);
});

});

router.get('/login/google', function(req, res) {

  var request = https.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=1/'+req.query.token, function(response) {

    console.log("Statuscode: ", response.statusCode);
    console.log("headers: ", response.headers);

    response.on('data', function(d) {

      process.stdout.write(d);
      d=JSON.parse(d);
      console.log(d.error);
      if( d.data && !(d.error=="invalid_token"))
      {
    //db.collections.find({facebook_user_id:options.user_id});

    user.findOne({fb_id:d.data.user_id}, function(err, result) {
      if (err) { console.log("error:",err) }

        if (result)
        {
         var id=hat();
         console.log(id);

         newid(id,result._id).save();
         res.end( JSON.stringify({ result:true, token: id }) );
          //res.redirect('/users/profile/?acc_token='+id)
        }
        else
        {
          var user = newUser( "google", d.data.user_id );
          user.save();
          var id = hat();
          console.log(id);
          newid( id, nu._id ).save();

          res.end( JSON.stringify({ result:true, token: id }) );
        }
      });
  }
  else{
    res.end( JSON.stringify({ result:false, err:{} } ) );
  }

});

  });

request.on('error', function(e) {
  console.error(e);
});

});


router.get('/login/password', function( req, res ){
  User.findOne( {username: req.query.username}, function( err, user ){
    if( err ){
      error.err(res,"102");
    }
    // TODO: Test this.
    if( bcrypt.compareSync( req.query.password, user.password ) ){
      var token = newid( hat(), user );
      token.save( function( err, token, num ){
        console.log( token );
        res.end( JSON.stringify({ result:true, access_token:token.access_token }) );
      });
    }
    else {
      error.err(res,"212");
    }

  });
});

router.get('/reset/password', function( req, res ){
  var user = req.user;
  /*
  * TODO: allow only users of type VENDOR & ADMIN to reset password.
  */
  var errobj = error.err_insuff_params(res,req,["new_password"]);
  if(!errobj) {
    return;
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync( req.query.new_password, salt );

  user.password = hash;
  user.save();
  res.end(JSON.stringify({ result:true }));

});

// TODO: check this.
router.get('/create', function(req,res,err) {
  var type = "vendor";
  var auth_type = "password";
  debugger;
      //if (err) error.err(res,"420");

      if( !req.query.vendor_id || !req.query.username ){
        error.err(res,"420");
        return;
      }

      var vendor_id = req.query.vendor_id;

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync( settings.auth.password.default, salt );

      var vuser = new user({ auth_type:auth_type, type:type,vendor_id:vendor_id, password:hash, username: req.query.username });
      vuser.save();


     /* user.save(function(err) {
        if(err) console.log(err);
      });*/

});



router.get('/profile',function(req,res){


  if( req.user.type == "Anonymous" ){
      // TODO: throw error.
    }
    //  TODO: Remove user private details.. remove password.
    res.end( JSON.stringify( req.user ) );
  });

module.exports = router;
