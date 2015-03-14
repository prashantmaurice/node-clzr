var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var models = require("./models");
var _ = require("underscore");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Checkin = models.CheckIn;
var User = models.User;
var VendorRequest = models.VendorRequest;
var Promise = mongoose.Promise;
var Q = require("q");
var OfferHandler = require("./predicate");
var error = require("./error");
var s3 = require("s3policy");
var policy = require("s3-policy");
var settings = require("./settings");
var push = require("./util/push");

router.get('/create', function (req, res) {
  var errobj = error.err_insuff_params(res, req, ["latitude", "longitude", "image", "fid", "name","settings","phone","question"]);
  if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;

    }
    var user=req.user;

    // TODO approve vendor
    /*if( user.type != "Admin" ){
      error.err( res, "200" );
      return;
    }*/

    var lat = req.query.latitude;
    var lon = req.query.longitude;
    var image = req.query.image;
    var fid = req.query.fid;
    var name = req.query.name;
    var settings = req.query.settings;
    var offers = [],
    offers_old = [],
    date_created = new Date();
    var vendor = new Vendor({
        //vendorid:vendorid,
        location: [lat, lon],
        name: name,
        offers: offers,
        phone: req.query.phone,
        question:req.query.question,
        image: image,
        offers_old: offers_old,
        fid: fid,
        date_created: date_created,
        dateUpdated:date_created,
        settings:settings
      });
      res.send({
        result: true,
        data: vendor
      });
      vendor.save();
  });


router.get('/get/all',function (req,res) {


    Vendor.find({},function(err,data) {
        if(err) {
            console.log(err);
            return;
        }
        res.send(JSON.stringify(data));
    });
});

router.get('/send/push', function (req, res) {
  var errobj = error.err_insuff_params(res, req, ["vendor_id","access_token","user_id","data"]);
  if (!errobj) {
    return;
  }

  var user = req.user;
  var user_id = req.query.user_id;
  var data = req.query.data;

  if(req.user.vendor_id != req.query.vendor_id) {
    error.err(res, "909");
    return;
  }

  User.findOne({_id:user_id}, function (err, puser) {
    push.sendPushNotification( puser.gcm_id, data);
    res.end(JSON.stringify({result:true}));
  });

});

router.get('/get', function (req, res) {

  var errobj = error.err_insuff_params(res, req, ["vendor_id"]);
  if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
      }

      var id = req.query.vendor_id;

      Vendor.findOne({
        _id: id
      }, function (err, vendor) {
        if (err) console.log(err);
        if ( !vendor ) {
          error.err( res, "845" );
          return;
        }

        Offer.find({
          _id: {
            $in: vendor.offers
          }
        }, function (err, offers) {
          if(err) console.log(err);
          var vendor_json = vendor.toJSON();
          vendor_json.offers = offers;
            //debugger;
            var offers_qualified = _.filter(offers, function(offer) {
              return OfferHandler.qualify(req.user,vendor,offer);
            });
            vendor_json.offers_qualified = offers_qualified;
            res.send(JSON.stringify(vendor_json));
            res.end();
          });

      });
    })

router.get('/addoffer', function (req, res) {
    var errobj = error.err_insuff_params(res, req, ["vendor_id", "offer_id","access_token"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }
     
  if( req.user.type != "Admin" && req.user.type !="Vendor"){
  // TODO: Only admin allowed. DONE.
  /*if( user.type != "Admin" ){*/
    error.err( res, "200" );
    return;
  }
       if(req.user.vendor_id != req.query.vendor_id) {
        error.err(res, "909");
        return;
       }
  // TODO: Only admin allowed. DONE.
  
      var vendorid = req.query.vendor_id;
      var offerid = req.query.offer_id;

      Vendor.update({
        _id: vendorid
      }, {
        $addToSet: {
          offers: offerid
        }
      }, function (err, num, raw) {
        debugger;
        if (err) console.log(err + ' num : ' + num + ' raw : ' + raw);
        else {
          res.send({
            result: true,
            data:raw
          });
        }
      })
    });

router.get('/upload-policy', function( req, res ){
    var errobj = error.err_insuff_params( res, req, ["vendor_id","access_token"] );
      if( !errobj ) {
        return;
      }
          /*
      TODO: Only allow if the user is linked to this vendor.
      */
    /*
      TODO: Only allow if the user is linked to this vendor.
    */
    if( !(req.user.type == "Admin") && req.user.type!="Vendor" ){
      error.err( res, "403" );
      return;
    }
    debugger;
    Vendor.findOne({
      _id : req.query.vendor_id
    }, function( err, vendor ){
        
      if( !vendor ){
        error.err( res, "200" );
      }
      var p = policy({
        secret: settings.s3.secret_key,
        length: 50000000,
        bucket: settings.s3.bucket,
        key: settings.s3.base_path + "/" + vendor.resource_name,
        expires: new Date(Date.now() + 600000),
        acl: 'public-read'
      });

      var obj = p;
      obj.key=settings.s3.access_key;
      
      res.end( JSON.stringify(obj) );
      });


    });

function attachStamps( user, vendors ){
  return _.map( vendors, function( vendor ){
    var new_vendor = vendor.toJSON();
    new_vendor.stamps = user.stamplist[new_vendor.fid] || 0;
    return new_vendor;
  });
}

router.get('/get/visitedV2', function( req, res ){
  var errobj = error.err_insuff_params( res, req, ["access_token"] );
       if( !errobj ) {
      return;
    }
  var user =  req.user;
  debugger;
  var fid_list =_.keys( user.stamplist );
  //console.log(fid_list);
  debugger;
  Vendor.find( { fid: { $in: fid_list }, visible : true} ).exec().then(
    function (vendors) {

      var vendor_det_ret_arr = [];
      var plist = [];
      for (var i = 0; i < vendors.length; i++) {
        var vendor = vendors[i];
        //console.log("Getting offers: ");
        //console.log(vendor.offers);
        var typelist = ["S1","SX","S0"];
        var pr = Offer.find({
          _id: {
            $in: vendor.offers
          },
          type:{
            $in: typelist
          }
        }).exec();
        //debugger;
        plist.push(
          pr.then(
            (function( vendor, index ){
              return function (offers) {
                var deferred = Q.defer();
                debugger;
                var offers_new = _.filter(offers, function (offer) {
                  return OfferHandler.qualify(req.user, vendor, offer);
                });
                //debugger;
                var vendor_new = vendor.toJSON();
                vendor_new.offers = offers_new;
                vendor_new.stamps = user.stamplist[vendor_new.fid] || 0;
                //console.log( vendor_new );
                vendor_det_ret_arr[index] = (vendor_new);
                //debugger;
                process.nextTick(function () {
                  //console.log("resolving.");
                  deferred.resolve();
                });
                return deferred.promise;
              };
            })( vendors[i], i )
            ));

      }
        //debugger;
        Q.all(plist).then(function () {
          debugger;
          //console.log("RESOLVED.");
          res.send(JSON.stringify({result:true, data:vendor_det_ret_arr}));
          res.end();
        });

      });
});
router.get('/get/visited', function( req, res ){
  var errobj = error.err_insuff_params( res, req, ["access_token"] );
  var user =  req.user;
  debugger;
  var fid_list =_.keys( user.stamplist );
  console.log(fid_list);
  debugger;
  Vendor.find( { fid : { $in : fid_list } }, function( err, vendors ){
    if( err ){
      //TODO: Put error.
    }
    res.end( JSON.stringify({ result:true, data:attachStamps( user, vendors ) }) );
  });


});

router.get("/request", function( req, res ){
   var errobj = error.err_insuff_params( res, req, ["access_token","name"] );
       if( !errobj ) {
      return;
    }
	var user = req.user;
	var request = new VendorRequest( {account:user._id, name:req.query.name, remarks:req.query.remarks } );
	request.save();
	res.end(JSON.stringify( {result:true} ) ) ;
});


router.get('/get/near', function (req, res) {

  var errobj = error.err_insuff_params(res, req, ["latitude", "longitude"]);

  if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
      }

      var type = req.query.type;

      if( !type )
        type = JSON.stringify(["S0","S1","SX"]);

      var limit = req.query.limit;

      if( !limit )
        limit = settings.api.default_limit;

      var offset = req.query.offset;
        if( !offset )
        offset = 0;
      var user=req.user;
    var lat = req.query.latitude;
    var lon = req.query.longitude;
    var distance = req.query.distance;
    var access_token = req.query.access_token;
    var typelist = JSON.parse( type );
    var vendorResult;
    console.log( typelist );
    debugger;

   if(user.type!='TestUser'){
        debugger;
        Vendor.find({
          location: {
            $near: [lat, lon]
        },
        visible:true
    }).limit( limit ).skip( offset ).exec().then(function (vendors) {
      debugger;
        getoff(vendors, req.user,typelist,function( vendors ){
          res.send(JSON.stringify( vendors ));
          res.end();
        });
    });}
    else   
    {
          Vendor.find({location:{
        $near:[lat,lon]
      },
        test:true
      }).limit(limit).skip(offset).exec().then(function (vendors){
         debugger;
         getoff(vendors, req.user,typelist,function( vendors ){
          res.send(JSON.stringify(vendors));
          res.end();
         });
        });  
      }
 });         

        function getoff( vendors, user,typelist,callback ){
          debugger;
          var vendor_det_ret_arr = [];
          var plist = [];
          for (var i = 0; i < vendors.length; i++) {
            var vendor = vendors[i];
            console.log("Getting offers: ");
            console.log(vendor.offers);
            var pr = Offer.find({
              _id: {
                $in: vendor.offers
              },
              type:{
                $in: typelist
              }
            }).exec();
            debugger;
            plist.push(
             pr.then(
               (function( vendor, index ){
                return function (offers) {
                  var deferred = Q.defer();
                  debugger;
                  var offers_new = _.filter(offers, function (offer) {
                   return OfferHandler.qualify(user, vendor, offer);
                 });
                //debugger;
                var vendor_new = {};
                vendor_new.location = vendor.location;
                vendor_new.name = vendor.name;
                if(vendor.settings)
                  vendor_new.settings = vendor.settings;
                vendor_new.offers = offers_new;
                vendor_new.image = vendor.image;
                vendor_new.fid = vendor.fid;
                vendor_new._id = vendor._id;
                console.log( vendor_new );
                vendor_det_ret_arr[index] = (vendor_new);
              //debugger;
              process.nextTick(function () {
                console.log("resolving.");
                deferred.resolve();
              });
              return deferred.promise;
            };
          })( vendors[i], i )
          ));

}
        //debugger;
        Q.all(plist).then(function () {
          callback( vendor_det_ret_arr );
        });
      }
/*
router.get('/settings/save', function (req, res) {
  res.end(JSON.stringify(req.query));
  console.log(req.query.settings.birthday.when);
  */


router.get('/updatesettings',function (req,res){
  var errobj = error.err_insuff_params(res, req, ["vendor_id","access_token"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }
    var user = req.user;
    debugger;
    if(user.type != "Admin" && user.type != "Vendor"){
      error.err( res, "200" );
      return;
    }

    var vendor_id=req.query.vendor_id;
    Vendor.findOne({_id:vendor_id},function (err,vendor){

        if(req.query.birthday_notify1st){
          vendor.settings.birthday_notify1st=req.query.birthday_notify1st;
        }
        if(req.query.birthday_notifyExact){
          vendor.settings.birthday_notifyExact=req.query.birthday_notifyExact;
        }
        if(req.query.neighDistance){
          vendor.settings.neighDistance=req.query.neighDistance;
        }
      })
    })

  router.get('/update', function (req, res) {
    var latitude, longitude, image, fid, name, visible, address, city, phone, description, settings={};
    var question;
    var UUID;
    var errobj = error.err_insuff_params(res, req, ["vendor_id","access_token"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
      }

      var id = req.query.vendor_id;
      var user=req.user;

      if( user.type != "Admin" && user.type !="Vendor" ){
        error.err( res, "200" );
        return;
      }

      Vendor.findOne({
        _id: id
      }, function (err, vendor) {
        if (err) console.log(err);
        if (vendor) {
          if (req.query.latitude) {
            latitude = req.query.latitude;
          } else latitude = vendor.location[0];
          //debugger;
          if (req.query.longitude) {
            longitude = req.query.longitude;
          } else longitude = vendor.location[1];

          dateUpdated = new Date();
          if (req.query.image) {
            image = req.query.image;
          } else image = vendor.image;

          if (req.query.fid) {
            fid = req.query.fid;
          } else fid = vendor.fid;

          if(req.query.vendor_name){
            name=req.query.vendor_name;
          }else name=vendor.name;

          if(req.query.phone){
            phone=req.query.phone;
          }else phone = vendor.phone;

          if(req.query.address){
            address = req.query.address;
          }else address=vendor.address;

          if(req.query.city){
            city=req.query.city;
          }else city=vendor.city;

          if( req.query.visible ){
            visible = (req.query.visible == "true");
          }else visible = vendor.visible;

          if( req.query.description ){
            description = req.query.description;
          }else description = vendor.description;

          if( req.query.resource_name ){
            resource_name = req.query.resource_name;
          }else resource_name = vendor.resource_name;

          if( req.query.question){
            question=req.query.question;
          }else question=vendor.question;
          if(req.query.settings) {
            settings = req.query.settings;
            console.log(settings);
          }
          else settings = vendor.settings;
          if(req.query.UUID){
            UUID=req.query.UUID;
          }else UUID=vendor.UUID;
          var date_created = vendor.date_created;
          vendor.location = [latitude, longitude];
          vendor.image = image;
          vendor.fid = fid;
          vendor.date_created = date_created;
          vendor.dateUpdated = new Date();
          vendor.name = name;
          vendor.visible = visible;
          vendor.city = city;
          vendor.address = address;
          vendor.phone = phone;
          vendor.description = description;
          vendor.resource_name = resource_name;
          vendor.question=question;
          vendor.settings = settings;
          vendor.UUID=UUID; 
          console.log("question\n"+vendor.question);
          console.log("Saving");
          debugger;
          
          vendor.markModified("settings");
          vendor.markModified("settings.birthday");
          vendor.save(function (err, res) {
            console.log("Saved");
            console.log(res); 
            console.log(err);
          });
          res.send(JSON.stringify({result:true}));
        }
        else {

          error.err(res,"210");
          return;

        }
        res.end();
      });

});
router.get('/checkins',function (req,res){

    var errobj = error.err_insuff_params(res, req, ["vendor_id","access_token"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }
    var user=req.user;
    if( user.type != "Admin" && user.type !="Vendor" ){
        error.err( res, "200" );
        return;
    }
    if(req.query.startdate && req.query.enddate && req.query.vendor_id){
        Checkin.find({
            "date_created" : {
                "$gte" : req.query.enddate,
                "$lte" : req.query.startdate
            },
            "vendor" : req.query.vendor_id
        },function(err,result){
            res.json(result);
            res.end();
        })
    } else {
        Checkin.find({
            "vendor" : req.query.vendor_id
        },function(err,result){
            res.json(result);
            res.end();
        })
    }
})
module.exports = router;

