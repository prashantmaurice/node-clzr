var express = require('express');
var hat=require('hat');
var settings = require('./settings');
var https = require('https');
var mongoose=require('mongoose');
var models = require("./models");
var error = require("./error");
var bcrypt = require("bcrypt-nodejs");
var _ = require("underscore");

var router = express.Router();
var user = models.User;
var User = user;
var Vendor = models.Vendor;
function newUser( backend, id ) {
    var nuser=new user({
        auth_type: backend,
        social_id:id,
        stamplist:{ STANDARD:0 },
        type:"User",
        date_created: new Date(),
        favourites:[],
        pinned:[],
        rewards:[]
    });
    nuser.markModified("stamplist");
    return nuser;
}
function newVendorUser( backend, id ) {
    var nVendor=new Vendor({
        //TODO initialize vendor
    })
    var nuser=new user({
        auth_type: backend,
        social_id:id,
        vendor_id:nVendor._id,
        stamplist:{ STANDARD:0 },
        type:"Vendor",
        date_created: new Date(),
        favourites:[],
        pinned:[],
        rewards:[]
    });
    nuser.markModified("stamplist");
    return nuser;
}
function loadFacebookDetails( user, access_token, cb ){
    https.get("https://graph.facebook.com/me/?access_token=" + access_token, function( response ){

        response.on("data", function( dat ){
            var obj = JSON.parse( dat.toString() );
            user.profile = obj;
            user.markModified("profile");
            user.upgraded = new Date();
            cb( user );
        });

    });
}

function loadGoogleDetails( user, access_token, cb ){
    https.get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + access_token, function( response ){

        response.on("data", function( dat ){
            var obj = JSON.parse( dat.toString() );
            user.profile = obj;
            user.upgraded = new Date();
            user.markModified("profile");
            cb( user );
        });

    });
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

    var errobj = error.err_insuff_params(res,req,["token"]);
    if(!errobj) {
        return;
    }
    var type='user';
    if(req.query.type) type=req.query.type;

	var analytics = global.registry.getSharedObject("view_analytics_hit").get;

    var request = https.get('https://graph.facebook.com/debug_token?input_token=' + req.query.token + '&access_token='+settings.auth.facebook.app_token, function(response) {
        debugger;
		

        response.on('data', function(dat) {
            debugger;
            d=JSON.parse(dat.toString());
            console.log(d);
            if( d.data && d.data.is_valid )
            {

                user.findOne({social_id:d.data.user_id}, function(err, result) {
                    if (err) { console.log("error:") }
                        if (result)
                        {

                            if( !result.profile ){

                                loadFacebookDetails( result, req.query.token, function( user ){
                                    user.save();
                                    debugger;
                                    var id = hat();
                                //console.log(id);
                                newid( id, user._id ).save();
                                res.end( JSON.stringify( {result : true, token : id , user:user} ) );
                            });

                            }else{

                                var id = hat();
                                console.log(id);

                                newid( id, result._id ).save();
                                res.end( JSON.stringify( {result : true, token : id , user:result} ) );
								

                            }
							var params = req.query;
							params.error = false;
							params.created = false;
							analytics( { metric: "url_auth_login", dimensions: params }, result ).then( function(analytics){ console.log( analytics ) } );
                        }
                        else
                        {
                            var nu = (type=='user')? newUser( "facebook", d.data.user_id ):newVendorUser( "facebook", d.data.user_id );
                            loadFacebookDetails(nu,req.query.token, function( user ){
                                nu.save();
                                debugger;
                                var id=hat();
                            //console.log(id);
                            newid(id,nu._id).save();
                            res.end( JSON.stringify( {result : true, token : id , user:user} ) );
								//Record analytics.
							var params = req.query;
							params.error = false;
							params.created = true;
							analytics( { metric: "url_auth_login", dimensions: params }, user ).then( function(analytics){ console.log( analytics ) } );
                        });

                        }
                    });
}
else{
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

    var errobj = error.err_insuff_params(res,req,["token"]);
    if(!errobj) {
        return;
    }
    var type='user';
    if(req.query.type) type=req.query.type;
	var analytics = global.registry.getSharedObject("view_analytics_hit").get;
    var request = https.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + req.query.token, function(response) {
        debugger;

        response.on('data', function(dat) {
            debugger;
            d=JSON.parse(dat.toString());
            console.log(d);
            if( d.issued_to && _.find(settings.auth.google.app_id,function(app_id){return(d.issued_to == app_id)} ))
            {

                user.findOne({ social_id:d.user_id }, function(err, result) {
                    if (err) { console.log("error:") }
                        if (result)
                        {

                            if( !result.profile ){

                                loadGoogleDetails( result, req.query.token, function( user ){
                                    user.save();
                                    debugger;
                                    var id = hat();
                                //console.log(id);
                                newid( id, user._id ).save();
                                res.end( JSON.stringify( {result : true, token : id , user:user} ) );
                            });

                            }else{

                                var id = hat();
                                console.log(id);

                                newid( id, result._id ).save();
                                res.end( JSON.stringify( {result : true, token : id , user:result} ) );

                            }
							var params = req.query;
							params.error = false;
							params.created = false;
							analytics( { metric: "url_auth_login", dimensions: params }, result ).then( function(analytics){ console.log( analytics ) } );
                        }
                        else
                        {
                            var nu = (type=='user')? newUser( "google", d.user_id ):newVendorUser( "google", d.data.user_id );
                            loadGoogleDetails(nu,req.query.token, function( user ){
                                nu.save();
                                debugger;
                                var id=hat();
                            //console.log(id);
                            newid(id,nu._id).save();
                            res.end( JSON.stringify( {result : true, token : id , user:user} ) );
							
							var params = req.query;
							params.error = false;
							params.created = true;
							analytics( { metric: "url_auth_login", dimensions: params }, user ).then( function(analytics){ console.log( analytics ) } );
                        });

                        }
                    });
}
else{
    error.err( res, "102" );
}

});

});

    //req.end();

    request.on('error', function(e) {
        console.error(e);
    });

});

/*router.get('/login/google', function(req, res) {
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
});*/


router.get('/login/password', function( req, res ){
    var errobj = error.err_insuff_params(res,req,["username","password"]);
    if(!errobj) {
        return;
    }
    var type='user';
    if(req.query.type) type=req.query.type;
    User.findOne( {username: req.query.username}, function( err, user ){
        console.log(user);
        if( !user ){
            error.err(res,"102");
            return;
        }
        if( err ){
            console.log('error - user create');
            error.err(res,"102");
            return;
        }

        if( bcrypt.compareSync( req.query.password, user.password ) ){
            var token = newid( hat(), user );
            token.save( function( err, token, num ){
                console.log( token );
                res.end( JSON.stringify({ result:true, access_token:token.access_token, user:user }) );
            });
        }
        else {
            error.err(res,"212");
        }
        user.dateLastLogin = new Date();
        user.save();

    });
});

router.get('/login/verifypassword', function( req,res) {
    var errobj = error.err_insuff_params(res,req,["username","password"]);
    if(!errobj) {
        return;
    }
    var type='user';
    if(req.query.type) type=req.query.type;
    User.findOne( {username: req.query.username}, function( err, user ){
        console.log(user);
        if( !user ){
            error.err(res,"102");
            return;
        }
        if( err ){
            console.log('error - user create');
            error.err(res,"102");
            return;
        }

        if( bcrypt.compareSync( req.query.password, user.password ) ){
            
                res.end( JSON.stringify({ result:true}) );
        
        }
        else {
            error.err(res,"212");
        }

    });
});

router.get('/reset/password', function( req, res ){
    var errobj = error.err_insuff_params(res,req,["access_token","new_password"]);
    if(!errobj) {
        return;
    }
    var user = req.user;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync( req.query.new_password, salt );

    user.password = hash;
    user.save();
    res.end(JSON.stringify({ result:true }));

});

router.get('/logout', function( req, res ){
     var errobj = error.err_insuff_params( res, req, ["access_token"] );
    if( !errobj ) {
        return;
    }
    var user = req.user;

       debugger;
    token.remove({ account: user._id }, function( err, data ){
        console.log( err );
        console.log( data );
    });
    user.dateLastLogout = new Date();
    user.save();
    res.end(JSON.stringify({ result:true }));
});

router.get('/create', function( req, res ) {
    if( !req.query.vendor_id || !req.query.username ){
        error.err(res,"420");
        return;
    }

    // TODO: Only Admin allowed.
    var type = "Vendor";
    var auth_type = "password";
    debugger;
    //if (err) error.err(res,"420");

    

    var vendor_id = req.query.vendor_id;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync( settings.auth.password.default, salt );

    var vuser = new user({ auth_type:auth_type, type:type,vendor_id:vendor_id, password:hash, username: req.query.username });
    vuser.save();

    res.end( JSON.stringify({
        result:true
    }) );

    /* user.save(function(err) {
     if(err) console.log(err);
 });*/

});



router.get('/profile',function(req,res){


    if( req.user.type == "Anonymous" ){
        error.err(res,"909");
        return;
    }
    //  TODO: Remove user private details.. remove password.
    res.end( JSON.stringify( req.user ) );
});

router.get("/update/gcm", function( req, res ){
    if( req.user.type != "User" ){
        error.err( res, "909" );
        return;
    }
    req.user.gcm_id = req.query.gcm_id;
    req.user.save();
    res.end( JSON.stringify( {result:true, user:req.user} ) );
});
module.exports = router;
