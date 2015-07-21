

var registry = global.registry;
var Q = require("q");
var _ = require('underscore')
var fuzzy = require('fuzzy');

//var express = require('express');
//var mongoose = require('mongoose');
//var router = express.Router();
//var Schema = mongoose.Schema;
//var models = require('./models');
//var Review = models.Review;
//var error = require("./error");
//var _ = require('underscore');


function view_vendor_review_create( params, user ) {

    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    var checkinQ = checkinM.get( params );


    var checkin_id = params.checkin_id;
    var stars = params.stars;
    var remarks = params.remarks;

    console.log("View: Review Create");
    console.log("Checkin ID");
    console.log( stars );
    console.log( remarks );

    debugger;

    var point2 = checkinQ.then( function( checkin ){

        // Check is checkin belongs to user.
        debugger;
        console.log( "Checkin: User: " + checkin.user );
        console.log( "User: " + user._id );

        if( checkin.user._id.toString() != user._id.toString() ){
            deferred.resolve( {code:204,error:"Checkin does not match user."} );
            return;
        }

        debugger;

        var dateCreated = new Date();
        var Review = registry.getSharedObject("models_Review");

        debugger;

        var review = new Review({
            checkinid: checkin_id,
            date_created: dateCreated,
            stars: stars,
            remarks: remarks,
            vendor_id: checkin.vendor
        });

        deferred.resolve( { result:true, data:review } );
        review.save(function (err) {
            if (err) console.log(err);
        });

        // Do some post checkin stuff here.

    });

    return deferred.promise;
}

function view_vendor_review_get( params, user ){
    var deferred = Q.defer();

    var reviewM = registry.getSharedObject("data_review");
    reviewM.get(params).then( function( review ){
        debugger;
        if( !review ){
            deferred.resolve( {code:204,error:"No proper review object." } );
            return;
        }

        deferred.resolve( { result:true,data: review } );

    });

    return deferred.promise;
}

var view_vendor_review_all = function (params,user) {
  return Q(registry.getSharedObject('data_reviews').get({vendor_id:params.vendor_id}))
}
global.registry.register("view_vendor_review_get", {get:view_vendor_review_get});
global.registry.register("view_vendor_review_create", {get:view_vendor_review_create});
global.registry.register("view_vendor_review_all", {get:view_vendor_review_all});
