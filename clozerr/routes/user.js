var express = require('express');
var hat=require('hat');
var settings = require('./settings');
var https = require('https');
var mongoose=require('mongoose');
var models = require("./models");
var error = require("./error");
var bcrypt = require("bcrypt");

var router = express.Router();
var user = models.User;

function newuserfb(fb){
 var nuser=new user({
  name:'',
  fb_id:fb
 });
 return nuser;
}

function newusergp(gp){
  var nuser=new user({
    type:"user"
    name:'',
    gp_id:gp
  })
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
  return newid( id, acc ).save().exec();
}

router.get('/login/facebook', function(req, res) {
  /*
    TODO: check req parameters.
  */

  var request = https.get('https://graph.facebook.com/debug_token?input_token=' + req.query.fb_token + '&access_token='+settings.auth.facebook.app_token, function(response) {
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
              var nu = newuserfb(d.data.user_id);
              nu.save();
              var id=hat();

              console.log(id);

              newid(id,nu._id).save();
              debugger;
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

var request = https.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=1/'+req.query.gp_token, function(response) {

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
          //console.log(result._id);
         // res.send(result);
         var id=hat();
         console.log(id);

         newid(id,result._id).save();
         res.end( JSON.stringify({ result:true, token: id }) );
          //res.redirect('/users/profile/?acc_token='+id)
           }
           else
            {
              var nu=newuser(d.data.user_id);
              nu.save();
              var id=hat();
              console.log(id);
              newid(id,nu._id).save();
              res.end( JSON.stringify({ result:true, token: id }) );
            }
      });
    }
        else{
              res.end( JSON.stringify({ result:false, err:{} } ) );
      // TODO: create error.js
            }

    });

  });


router.get('/login/password', function( req, res ){
  User.findOne( {username: req.query.username}, function( err, user ){
    if( err ){
      // TODO: throw error.
    }
    // TODO: Test this.
    if( bcrypt.compareSync( req.query.password, user.password ) ){
      loginUser( user ).then( function( token ){
        res.end( JSON.stringify({ result:true, access_token:token.token }) );
      });
    }

  });
});
request.on('error', function(e) {
    console.error(e);
});

});

// TODO: check this.
router.get('/create', function(req,res,err) {
      var type = "vendor";
      if (err) error.err(res,"420");
      if( !req.query.vendor_id || !req.query.username ){
        // TODO: Throw error.
        return;
      }

      var vendor_id = req.query.vendor_id;

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync( settings.auth.password.default, salt );

      var user = new User({ type:type,vendor_id:vendor_id, password:hash, username: req.query.username });
      user.save(function(err) {
        if(err) console.log(err);
      });
       
  });



router.get('/profile',function(req,res){

    //  TODO: Remove user private details.


    res.end( JSON.stringify( req.user ) );
});

module.exports = router;
