var express = require('express');

var router = express.Router();
var hat=require('hat');
var settings = require('./settings');
/* GET home page. */
var https = require('https');
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var user=mongoose.model('user',new Schema({
name:String,
fb_id:Number,
gp_id:Number
}));
function newuserfb(fb){
 var nuser=new user({
  name:'',
  fb_id:fb
 });
 return nuser;
}
function newusergp(gp){
  var nuser=new user({
    name:'',
    gp_id:gp
  })
}
var token=mongoose.model('token',new Schema({
  access_token:String,
  account_id:String
}));
function newid(tok,acc){
  var nuser_id=new token({
    access_token:tok,
    account_id:acc
  });
  return nuser_id;
}
router.get('/loginfb', function(req, res) {

var request = https.get('https://graph.facebook.com/debug_token?input_token='+req.query.fb_token+'&access_token=643340145745435|nyelclS2lAU75ksOpYtfOLNtwOg', function(response) {
  debugger;
  console.log("Statuscode: ", response.statusCode);
  console.log("headers: ", response.headers);

  response.on('data', function(d) {
    debugger;
    process.stdout.write(d);
    d=JSON.parse(d);
    console.log(d.data.is_valid);
    if( d.data && d.data.is_valid )
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
         debugger;
         newid(id,result._id).save();
          //res.redirect('/users/profile/?acc_token='+id)
           } 
           else
            {var nu=newuserfb(d.data.user_id);
          nu.save();
          var id=hat();
          console.log(id);
          newid(id,nu._id).save(); 
         res.redirect('/users/profile/?acc_token='+id)
        }
      });
    }else{
      res.end( JSON.stringify({ result:false, err:{} } ) );
      // TODO: create error.js
    }

    });

  });

//req.end();

request.on('error', function(e) {
    console.error(e);
});

});
router.get('/logingp', function(req, res) {

var request = https.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=1/'+req.query.gp_token, function(response) {
  debugger;
  console.log("Statuscode: ", response.statusCode);
  console.log("headers: ", response.headers);

  response.on('data', function(d) {
    debugger;
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
         debugger;
         newid(id,result._id).save();
          //res.redirect('/users/profile/?acc_token='+id)
           } 
           else
            {var nu=newuser(d.data.user_id);
          nu.save();
          var id=hat();
          console.log(id);
          newid(id,nu._id).save(); 
         res.redirect('/users/profile/?acc_token='+id)
        }
      });
    }else{
      res.end( JSON.stringify({ result:false, err:{} } ) );
      // TODO: create error.js
    }

    });

  });

//req.end();

request.on('error', function(e) {
    console.error(e);
});

});
router.get('/create', function(req, res) {
 var name,acc_token;
 if(req.query.name)name=req.query.name;
  if(req.query.acc_token)acc_token=req.query.acc_token;
  token.findOne({access_token:acc_token},function(err,result){
    if(err){console.log("error:",err)}
      if(result)
      {
        user.findOne({fb_id:result.facebook_id},function(err,resu){
          if(err){console.log("error:",err)}
            if(resu){
             var upsertData = resu.toObject();
             resu.update({name:req.query.name}, upsertData, {upsert: true}, function(err){});
            }
            else
            {
              res.send('oops..sry login again');
            }
        });
      }
      else
      {
        res.send('oops..sry pls login again.');
      }
  });

});
router.get('/profile',function(req,res){
  token.findOne({access_token:req.query.acc_token},function(err,result){
    debugger;
    if(err){console.log("error:",err)}
      if(result)
      {
        //res.send(result);
        user.findOne({_id:result.account_id},function(err,resu){
          debugger;
          if(err){console.log("error:",err)}
            if(resu){
              res.send(resu);
                }
                else
                {
                  res.send('oops..sry login again');
                }
        });
      }
      else
      {
        res.send('oops..sry pls login again.');
      }
  })
})

module.exports = router;
