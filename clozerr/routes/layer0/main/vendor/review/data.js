

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


function data_review( params ){
    //var deferred = Q.defer();

    var Review = registry.getSharedObject("models_Review");

    return Review.findOne( params )

    //deferred.resolve( { result: true, data:review } );
    //return deferred;
}

function data_reviews( params ){
    //var deferred = Q.defer();

    var Review = registry.getSharedObject("models_Review");

    return Review.find( params )

    //deferred.resolve( { result: true, data:review } );
    //return deferred;
}
global.registry.register("data_review", {get:data_review});
global.registry.register("data_reviews", {get:data_reviews});
