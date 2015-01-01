var express = require('express');

var router = express.Router();
var hat=require('hat');
var settings = require('./settings');
/* GET home page. */
var https = require('https');
var mongoose=require('mongoose');

var user=mongoose.model('user',{
name:String,
fb_id:Number,
stamplist:{}
});
function newuser(fb){
 var nuser=new user({
  name:'',
  fb_id:fb,

 });
 return nuser;
}
var token=mongoose.model('token',{
  access_token:String,
  facebook_id:Number
})
function newid(tok,fb){
  var nuser_id=new token({
    access_token:tok,
    facebook_id:fb
  });
  return nuser_id;
}
router.get('/login', function(req, res) {

var options = {
  hostname: 'graph.facebook.com',
  port: 443,
  path: 'debug_token?input_token='+req.query.fb_token+'&access_token='+app_token,
  method: 'GET'
};

var request = https.get('https://graph.facebook.com/debug_token?input_token='+req.query.fb_token+'&access_token=643340145745435|nyelclS2lAU75ksOpYtfOLNtwOg', function(response) {
  debugger;
  console.log("Statuscode: ", response.statusCode);
  console.log("headers: ", response.headers);

  response.on('data', function(d) {

    process.stdout.write(d);
    d=JSON.parse(d);
    if(d.is_valid=='true')
    {
    //db.collections.find({facebook_user_id:options.user_id});
  
      user.findOne({fb_id:d.user_id}, function(err, result) {
        if (err) { console.log("error:",err) }
          
        if (result)
         {
         var id=hat();
         console.log(id);
         newid(id,d.user_id).save();
         res.redirect('/profile?'+id);
           } 
           else
            {
          newuser(d.user_id).save();
          var id=hat();
          console.log(id);
          newid(id,d.user_id).save(); 
          res.redirect('/profile?'+id); 
        }
      });
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
  token.findOne({access_token:rep.query.access_token},function(err,result){
    if(err){console.log("error:",err)}
      if(result)
      {
        res.send(result);
      }
      else
      {
        res.send('oops..sry pls login again.');
      }
  })
})

module.exports = router;