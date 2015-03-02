//var mocha = require("mocha");
var mongoose = require("mongoose");
var settings = require("./settings").settings;
var http = require("http");
var should = require("should");
var assert = require("assert");

var db = mongoose.connection;
db.open('mongodb://'+settings.mongo.username+":"+settings.mongo.password+"@"+settings.mongo.host+'/'+settings.mongo.database);

describe("Testing get/near functionality", function(){
        console.log("test1");
        it("should not work without lat, long", function(done){
            http.get(settings.core.server + "/vendor/get/near", function(res) {
                res.on('data', function(body) {
                    var result = JSON.parse( body.toString() );
                    //console.log( result );
                    result.result.should.equal(false);
                    done();
                });
            });
        });


        it("should work with lat, long", function(done){
            this.timeout(10000);
            http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10", function(res) {
                res.on('data', function(body) {
                    var result = JSON.parse( body.toString() );
                    //console.log( result );
                    //result.result.should.equal(true); 
                    done();
                });
            });
        });


});
