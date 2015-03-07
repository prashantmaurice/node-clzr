var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Data =require('./models').Data;

router.get('/click',function (req,res){
    //get vendor click
    if( req.query.vendor_id && req.query.user_id ) {
        var data = new Data({
            type: "click",
            content: {
                vendor_id: req.query.vendor_id,
                user_id: req.query.user_id
            }
        });
        data.save(function(err){
            if(err) {
                console.log(err);
                res.send(JSON.stringify({result : false , error: err}));
            } else {
                res.send(JSON.stringify({result : true , data: data}));
            }
        })
    } else {
        res.send(JSON.stringify({result : false , error: "insufficient parameters"}));
    }
});

router.get('/view',function (req,res){
    //when user sees a vendor on his list
    if( req.query.vendor_id && req.query.user_id ) {
        var list_pos = (req.query.list_pos)?-1:req.query.list_pos;
        var data = new Data({
            type: "view",
            content: {
                vendor_id: req.query.vendor_id,
                user_id: req.query.user_id,
                list_pos : list_pos
            }
        });
        data.save(function(err){
            if(err) {
                console.log(err);
                res.send(JSON.stringify({result : false , error: err}));
            } else {
                res.send(JSON.stringify({result : true , data: data}));
            }
        })
    } else {
        res.send(JSON.stringify({result : false , error: "insufficient parameters"}));
    }
});

router.get('/login',function (req,res){
    //when user logs in
    if(req.query.user_id ) {
        var data = new Data({
            type: "login",
            content: {
                user_id: req.query.user_id
            }
        });
        data.save(function(err){
            if(err) {
                console.log(err);
                res.send(JSON.stringify({result : false , error: err}));
            } else {
                res.send(JSON.stringify({result : true , data: data}));
            }
        })
    } else {
        res.send(JSON.stringify({result : false , error: "insufficient parameters"}));
    }
});

router.get('/location',function (req,res){
    //get user location
    if(req.query.user_id && req.query.latitude && req.query.longitude) {
        var data = new Data({
            type: "location",
            content: {
                user_id: req.query.user_id,
                latitude : req.query.latitude,
                longitude : req.query.longitude
            }
        });
        data.save(function(err){
            if(err) {
                console.log(err);
                res.send(JSON.stringify({result : false , error: err}));
            } else {
                res.send(JSON.stringify({result : true , data: data}));
            }
        })
    } else {
        res.send(JSON.stringify({result : false , error: "insufficient parameters"}));
    }
});

module.exports = router;