

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


function view_review_create( params, user ) {

    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    var checkinQ = checkinM.get( { _id : params.checkin_id } );


    var checkin_id = params.checkin_id;
    var stars = params.stars;
    var remarks = params.remarks;

    console.log("View: Review Create");
    console.log("Checkin ID");
    console.log( stars );
    console.log( remarks );

    var point2 = checkinQ.then( function( checkin ){
        
        // Check is checkin belongs to user.
        console.log( "Checkin: User: " + checkin.user );
        console.log( "User: " + user._id ); 

        if( checkin.user != user._id ){
            deferred.reject( {description:"Checkin does not match user."} );
            return;
        }

        var dateCreated = new Date();

        var review = new Review({
            checkinid: checkin_id,
            date_created: dateCreated,
            stars: stars,
            remarks: remarks
        });

        deferred.resolve( { result:true, data:review } );
        review.save(function (err) {
            if (err) console.log(err);
        });

        // Do some post checkin stuff here.

    });
    
    return deferred;
}

function view_review_get( params, user ){
    var deferred = Q.defer();

    var reviewM = registry.getSharedObject("data_review");
    reviewM.get({ _id:params.id }).then( function( review ){
        if( !review ){
            deferred.reject( { description:"No proper review object." } );
            return;
        }
        
        deferred.resolve( { data: review } );

    });

    deferred.resolve( { result: true, data:review } );
    return deferred;
}

global.registry.register("view_review_get", {get:view_review_get});
global.registry.register("view_review_create", {get:view_review_create});
