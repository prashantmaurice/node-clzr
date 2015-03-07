//var mocha = require("mocha");
var mongoose = require("mongoose");
var settings = require("./settings").settings;
var http = require("http");
var should = require("should");
var assert = require("assert");
var models = require("../routes/models");
var _ = require("underscore");
var Q = require("q");

var db = mongoose.connection;
db.open('mongodb://'+settings.mongo.username+":"+settings.mongo.password+"@"+settings.mongo.host+'/'+settings.mongo.database);

before(function( done ){
    this.timeout(10000);
    console.log("Finding User");
    if( !settings.dummy_user.username ){
        throw {err:"ABORT. Dummy User has invalid details."}
        done();
    }

    models.User.findOne({
        username:settings.dummy_user.username
    }).exec().then(function( res ){
        console.log("User found: ");
        console.log(res);
        res.stamplist = { DEFAULT: 0 }; // Reset to 0.
        res.markModified("stamplist");
        res.save( function( err, modified ){
            console.log( err );
            console.log( modified );
            console.log("Finished resetting User object.. starting checkin system");
            done();
        });

    }, function( err ){
        console.log("Test user not present");
    });
});

describe("Fully Testing Checkin System", function(){
        console.log("Starting checkin system tests");
        describe("Checking in to the first offer", function(){

            models.User.findOne({ username: settings.dummy_user.username }).exec().then( function( account ){
                it("The dummy user account should exist", function(){
                    should.exist( account );
                });

                var deferred = Q.defer();

                it("the vendor should show up in lat-long search", function( done ){
                    http.get(settings.core.server + "vendor/get/near?latitude=" + settings.dummy_checkin.latitude + "&longitude" + settings.dummy_checkin.longitude + "&access_token=" + settings.dummy_user.access_token, function(res) {
                
                        res.on('data', function(body) {
                            var response = JSON.parse( body.toString() );
                            console.log("Response received from get/near");
                            var dummy = _.find( response, function( obj ){
                                return obj.name == settings.dummy_vendor.name;
                            });
                        
                            should.exist( dummy );
                            done();
                            deferred.resolve( dummy );
                        });
                        
                        //response.result.should.equal(false);
                        //done();
                    });

                });
                return deferred.promise;
            }).then( function( dummy ){
                var deferred = Q.defer();
                
                it("should have only one offer", function(){
                    dummy.offers.length.should.equal(1);
                });
               
                it("should have offer id", function(){
                    should.exist( dummy._id );
                });

                it("should have the correct number of stamps", function(){
                    dummy.offers[0].stamps.should.equal(1);
                });

                http.get(settings.core.server + "checkin/create/?offer_id=" + dummy.offers[0]._id + "&access_token=" + settings.dummy_user.access_token, function(res) {
                
                    res.on('data', function(body) {

                        var response = JSON.parse( body.toString() );
                        it("should return result:true for a first time checkin.", function(){
                            response.result.should.equal(true);
                        });
                        it("should have a checkin object appended to it", function(){
                            response.should.have.property('checkin');
                        });
                        it("should have a pin property with a 4 digit pin", function(){
                            response.checkin.should.have.property('pin').with.lengthOf(4);
                        });

                    });

                });
                return deferred.promise;
            });
        });


        /*it("should return something with lat, long", function(done){
            this.timeout(10000);
            http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10", function(res) {
                res.on('data', function(body) {
                    var result = JSON.parse( body.toString() );
                    response.result.should.equal(true);
                    done();
                });
            });
        });*/
    

});
