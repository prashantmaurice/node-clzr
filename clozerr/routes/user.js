var express = require('express');

var router = express.Router();
var hat=require('hat');
var settings = require('./settings');
/* GET home page. */
var https = require('https');
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var user=mongoose.model('User',new Schema({
    name:String,
    fb_id:Number
}));

function newuser(fb){
 var nuser=new user({
  name:'',
  fb_id:fb
 });
 return nuser;
}

var token=mongoose.model('token',new Schema({
  access_token:String,
  facebook_id:Number
}));

function newid(tok,acc){
  var nuser_id=new token({
    access_token:tok,
    account_id:acc
  });
  return nuser_id;
}

router.get('/facebook/login', function(req, res) {

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
         var id=hat();
         console.log(id);
         debugger;
         newid(id,result._doc._id.id).save();
         //res.redirect('/profile?'+id);
           } 
           else
            {
          newuser(d.data.user_id).save();
          var id=hat();
          console.log(id);
          newid(id,result._doc._id.id).save(); 
         // res.redirect('/profile?'+id); 
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
