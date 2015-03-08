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
        //console.log(res);
        res.stamplist = { DEFAULT: 0 }; // Reset to 0.
        res.markModified("stamplist");
        res.save( function( err, modified ){
            //console.log( err );
            //console.log( modified );
            console.log("Finished resetting User object.. starting checkin system");
        });

    }, function( err ){
        console.log("Test user not present");
    });
    models.CheckIn.find({vendor:settings.dummy_vendor.vendorid}).remove().exec().then(function(){
        console.log("resetting checkins");
        done();
    },function(err){
        console.log("no checkins");
    });
});

describe("Fully Testing Checkin System", function(){
        this.timeout(10000);
        console.log("Starting checkin system tests");
        describe("Checking in to the first offer", function(done){

    models.User.findOne({ username: settings.dummy_user.username }).exec().then( function( account ){
                it("The dummy user account should exist", function(){
                    should.exist( account );
                });

                var deferred = Q.defer();

                it("the vendor should show up in lat-long search", function( done ){
                    this.timeout(10000);
                    http.get(settings.core.server + "/vendor/get/near?latitude=" + settings.dummy_checkin.latitude + "&longitude=" + settings.dummy_checkin.longitude + "&access_token=" + settings.dummy_user.access_token, function(res) {
                
                        res.on('data', function(body) {
                            var response = JSON.parse( body.toString() );
                            console.log("Response received from get/near");
                            debugger;
                            var dummy = _.find( response, function( obj ){
                                debugger;
                                return (obj.name == settings.dummy_vendor.name);
                            });                 
                            should.exist( dummy );
                            done();
                            deferred.resolve( dummy );
                        }); 
                    });
                });
                return deferred.promise;
            }).then( function( dummy ){
                var deferred = Q.defer();
                var obj={dummy:dummy};
               describe("testing offer",function(done){
                it("should have only one offer", function(done){
                    console.log("has only one offer");
                    dummy.offers.length.should.equal(1);
                    done();
                });
               
                it("should have offer id", function(done){
                    should.exist( dummy._id );
                    done();
                });

                it("should have the correct number of stamps", function(done){
                    dummy.offers[0].stamps.should.equal('1');
                          done();
                });
                it("creating the checkin",function(done){
                this.timeout(10000);                
                    http.get(settings.core.server+"/checkin/create/?offer_id="+dummy.offers[0]._id+"&access_token="+settings.dummy_user.access_token+"&vendor_id="+settings.dummy_vendor.vendorid,function(res){
                     res.on('data',function(body){
                         var response=JSON.parse(body.toString());
                         obj.checkinobj=response;
                         deferred.resolve(obj);
                         done();
                        });
                    });
                });
                  });
                      return deferred.promise;
                      done();
                  }).then(function(obj){
                    var deferred=Q.defer();
                   
                    describe("tesing /create",function(done){
                    it("checking /create returns json with result:true ",function(done){
                            obj.checkinobj.result.should.equal(true);
                            done();
                    });
                it("checking /create returns json with  checkin object",function(done){
                            obj.checkinobj.should.have.property('checkin');
                            done();
                    });
                it("checking /create returns json with 4 digit pin ",function(done){
                            obj.checkinobj.checkin.should.have.property('pin').with.lengthOf(4);
                            done();
                });                                 
                  }); 
                    deferred.resolve(obj);
                    return deferred.promise;
                    done();
                  }).then(function(obj){
                var deferred=Q.defer();
                var obj2=obj;
             describe("getting the active object for user",function(done){
                it("getting the response",function(done){
                    this.timeout(10000);
                                 http.get(settings.core.server+"/checkin/active?access_token="+settings.dummy_user.access_token,function(res){
                          res.on('data',function(body){
                            var response=JSON.parse(body.toString());
                            obj2.resuser=response;
                             should.exist(obj2.resuser); 
                             deferred.resolve(obj2);
                             done();
                          });
                        });
                });
             });
                return deferred.promise;
                done();
                }).then(function(obj2){
                    var deferred=Q.defer();
                describe("checking /active for user",function(done){
                    it("should have result:true",function(done){
                        obj2.resuser.result.should.equal(true);
                        done();
                    });
                    it("it should have the user obj",function(done){
                       obj2.resuser.data[0].user.username.should.equal(settings.dummy_user.username);
                       done(); 
                    });
                    it("should have vendor obj",function(done){
                        obj2.resuser.data[0].vendor._id.should.equal(settings.dummy_vendor.vendorid);
                        done();
                    });
                    it("should have offerobj",function(done){
                       obj2.resuser.data[0].offer._id.should.equal(obj2.dummy.offers[0]._id);
                       done();
                    });
                });
                deferred.resolve(obj2);
                return deferred.promise;
                done();
                }).then(function(obj2){
                var deferred=Q.defer();
             describe("getting the active object for vendor",function(done){
                it("getting the response",function(done){
                    this.timeout(10000);
                    http.get(settings.core.server+"/checkin/active?access_token="+settings.dummy_vendor.access_token,function(res){
                          res.on('data',function(body){
                            var response=JSON.parse(body.toString());
                            obj2.resvendor=response;
                             should.exist(obj2.resvendor); 
                             deferred.resolve(obj2);
                             done();
                          });
                        });
                });
             });
                return deferred.promise;
                done();
                }).then(function(obj2){
                    var deferred=Q.defer();
                describe("checking /active for vendor",function(done){
                    it("should have result:true",function(done){
                        obj2.resvendor.result.should.equal(true);
                        done();
                    });
                    it("it should have the user obj",function(done){
                       obj2.resvendor.data[0].user.username.should.equal(settings.dummy_user.username);
                       done(); 
                    });
                    it("should have vendor obj",function(done){
                        obj2.resvendor.data[0].vendor._id.should.equal(settings.dummy_vendor.vendorid);
                        done();
                    });
                    it("should have offerobj",function(done){
                       obj2.resvendor.data[0].offer._id.should.equal(obj2.dummy.offers[0]._id);
                       done();
                    });
                });
                deferred.resolve(obj2);
                return deferred.promise;
                }).then(function(obj2){
                    var deferred=Q.defer();
                    describe("checking /valiadte ",function(done){
                        it("should return result:true for correct params",function(done){
                            this.timeout(10000);
                            http.get(settings.core.server+"/checkin/validate?access_token="+settings.dummy_vendor.access_token+"&checkin_id="+obj2.checkinobj.checkin._id,function(res){
                                res.on('data',function(body)
                                {
                                  var response = JSON.parse(body.toString());
                                  response.result.should.equal(true);
                                  done();
                                });
                            });
                        });
                    });
                    deferred.resolve(obj2);
                    return deferred.promise;
                }).then(function(obj2){
                  var deferred=Q.defer();
                  describe("getting checkin object",function(done){
                    it("should have been saved in database",function(done){
                        this.timeout(10000);
                        models.CheckIn.findOne({_id:obj2.checkinobj.checkin._id}).exec().then(function(res){
                            res.state.should.equal(1);
                            done();
                        });
                    });
                  });
                  deferred.resolve(obj2);
                  return deferred.promise;
                }).then(function(obj2){
                    var deferred=Q.defer();
                    describe("getting user object",function(done){
                        it("stamplist should have been updated",function(done){
                            this.timeout(10000);
                            models.User.findOne({username:settings.dummy_user.username}).exec().then(function(res){
                            var result=JSON.stringify(res);
                              result.split("\"stamplist\":{")[1].split(",")[0].should.equal('"10":1');
                             done();
                            });
                        });
                    });
                    deferred.resolve(obj2);
                    return deferred.promise;
                }).then(function(obj2){
                    var deferred=Q.defer();
                    describe("checking /confirmed",function(done){
                        it("/confirmed should return the checkin",function(done){
                            this.timeout(10000);
                            http.get(settings.core.server+"/checkin/confirmed?access_token="+settings.dummy_vendor.access_token,function(res)
                            {
                                res.on('data',function(body){
                                    var result=JSON.parse(body.toString());
                                    result[0].vendor.name.should.equal(settings.dummy_vendor.name);
                                    result[0].user.username.should.equal(settings.dummy_user.username);
                                    result[0].state.should.equal(1);
                                    result[0].offer._id.should.equal(obj2.dummy.offers[0]._id);
                                    done();
                                });
                            });
                        });
                    });
                      deferred.resolve(obj2);
                      return deferred.promise;
                });
            });

        });

