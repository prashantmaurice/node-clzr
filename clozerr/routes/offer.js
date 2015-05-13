var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Schema = mongoose.Schema;
var models = require('./models');
var Offer = models.Offer;
var Vendor = models.Vendor;
var error = require("./error");
var _ = require('underscore');;
router.get('/get', function (req, res) {

	var errobj = error.err_insuff_params(res, req, ["offer_id"]);
	if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }

    var id = req.query.offer_id;

    Offer.findOne({
    	_id: id
    }, function (err, data) {
    	if (err) console.log(err);
    	if (data) {
            data.caption=decodeURI(data.caption);
            data.description=decodeURI(data.description);
    		res.send(JSON.stringify({
					result:true,
					data:data
				}));

    		res.end();
    	} else {
    		error.err(res, "210");
    		res.end();
    	}
    })
});
router.get('/getmyoff',function(req,res){
    var errobj = error.err_insuff_params(res, req, ["access_token"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }
    var user=req.user;
    Offer.findOne({},
        function(err,data){
          if(err) console.log(err);
          if(data){
            res.send(JSON.stringify({result:true,data:data}));
          }
          else{
            error.err(res,"210");
          }
        })
});
router.get('/create', function (req, res) {
	// TODO: only admin allowed. DONE
    var errobj = error.err_insuff_params(res, req, ["access_token"]);
    if (!errobj) {
        //error.err(res,errobj.code,errobj.params);
        return;
    }
	var user = req.user;
	/*if( user.type != "Admin" ){
		error.err( res, "200" );
		return;
	}*/
    var type = req.query.type;
		if( !type ) type="S1";
    if (req.query.stamps) stamps = req.query.stamps;
    else stamps = 1;

		var caption = "default";
		var description = "default";
    if ( req.query.caption ) caption = unescape(req.query.caption);
    if ( req.query.description ) description = unescape(req.query.description);
    params={}
    if(req.query.params) params=JSON.parse(req.query.params)
    var dateCreated = new Date();

    var offer = new Offer({
    	type: type,
    	stamps: stamps,
    	dateCreated: dateCreated,
    	caption: caption,
    	description: description,
        params: params
    });
    console.log(offer);
    res.send( JSON.stringify( { result:true, data:offer } ) );
    offer.save(function (err) {
    	if (err) console.log(err);
    })
});
router.get('/update', function (req, res) {
	var type, stamps, caption, description;
	var user = req.user;
	/*if( user.type != "Admin" ){
		error.err( res, "200" );
		return;
	}*/

    //TODO : do validation here

	var errobj = error.err_insuff_params(res, req, ["offer_id"]);
	if (!errobj) {
        return;
  }

    var id = req.query.offer_id;
    var offer = Offer.findOne({
    	_id: id
    }, function (err, data) {
    	if (err) error.err(res, "210");
        return;
    });

    if (req.query.type) {
    	type = req.query.type;
    } else type = offer.type;
    //debugger;
    if (req.query.stamps) {
    	stamps = req.query.stamps;
    } else stamps = offer.stamps;
    dateUpdated = new Date();
    if (req.query.caption) {
    	caption = unescape(req.query.caption);
    } else caption = offer.caption;
    if (req.query.description) {
    	description = unescape(req.query.description);
    } else description = offer.description;

    var date_created = offer.date_created;

    Offer.findOne({
    	_id: id
    }, function (err, offer) {
    	if (err) console.log(err);
    	if (offer) {
            offer.type = type;
            offer.stamps = stamps;
            offer.caption = caption;
            offer.description = description;
            offer.date_created = date_created;
            offer.dateUpdated = new Date();
            offer.save(function (err) {
            	if (err) console.log(err);
            });
            res.send(JSON.stringify({ result:true, data:offer }	));
        }
        else {
        	//Throw error - no such offer
        	error.err(res,"210");
        }

        res.end();
    });

});

    router.get('/delete', function (req, res) {
        var errobj = error.err_insuff_params(res, req, ["offer_id"]);
    if (!errobj) {
        return;
  }

			var user = req.user;
			
    	var errobj = error.err_insuff_params(res, req, ["offer_id", "vendor_id"]);
    	if (!errobj) {
            //error.err(res,errobj.code,errobj.params);
            return;
        }

        var offer_id = req.query.offer_id;
        var vendor_id = req.query.vendor_id;

        if( user.type != "Vendor" && user.vendor_id != vendor_id ){
                error.err( res, "200" );
                return;
            }
       

        Vendor.findOne({
        	_id: vendor_id
        }, function (err, vendor) {
        	if (err) console.log(err);
        	vendor.offers_old.push(offer_id);
        	var arr_offers = vendor.offers;
        	var arr_updated_offers = [];

        	var len = arr_offers.length;
        	for(var i=0;i<len;i++) {
        		if(arr_offers[i] != offer_id) {
        			arr_updated_offers.push( arr_offers[i] );
        		}
        	}

        	vendor.offers = arr_updated_offers;
          vendor.save(function(err) {
          	if(err)	console.log(err);
          });
          res.send(JSON.stringify(vendor));
        });
    });

    module.exports = router;
