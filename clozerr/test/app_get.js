//var mocha = require("mocha");
var mongoose = require("mongoose");
var settings = require("./settings").settings;
var http = require("http");
var should = require("should");
var assert = require("assert");
var all,length;
var models = require("../routes/models");
var _ = require("underscore");
var Q = require("q");
var db = mongoose.createConnection('mongodb://'+settings.mongo.username+":"+settings.mongo.password+"@"+settings.mongo.host+'/'+settings.mongo.database);



describe("Testing get/near functionality", function(){
        console.log("test1");
        it("should not work without lat, long", function(done){
            http.get(settings.core.server + "/vendor/get/near", function(res) {
                res.on('data', function(body) {
                    var response = JSON.parse( body.toString() );
                        response.result.should.equal(false);
                    done();
                });
            });
        });


        it("should work with lat, long", function(done){
            this.timeout(10000);
            http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10", function(res) {
                res.on('data', function(body) {
                    var result = JSON.parse( body.toString() );
                    result[0].should.have.property('location');
                    result[0].should.have.property('name');
                    result[0].should.have.property('offers');
                    result[0].should.have.property('image');
                    result[0].should.have.property('fid');
                    result[0].offers.length.should.equal(1);
                    models.Vendor.find({visible:true},function(err,data) {
                        if(err) {
                            console.log(err);
                            return;
                            }
                            result.length.should.equal(data.length);
                        }); 
                    all=result;
                    done();
                });
            });
        });
        describe("testing limit and offset",function(done){
            it("should work with offset=0",function(done){
                this.timeout(10000);
                http.get(settings.core.server+"/vendor/get/near?latitude=10&longitude=10&limit=10",function(res){
                    res.on('data',function(body){
                        var result=JSON.parse(body.toString());
                        result[0].should.have.property('location');
                        result[0].should.have.property('name');
                        result[0].should.have.property('offers');
                        result[0].should.have.property('image');
                        result[0].should.have.property('fid');
                        result[0].offers.length.should.equal(1);
                        result.length.should.equal(10);
                        done();
                    });
                });
            });
            it("testing offset",function(done){
                this.timeout(10000);
                http.get(settings.core.server+"/vendor/get/near?latitude=10&longitude=10&offset=3",function(res){
                    res.on('data',function(body){
                      var result=JSON.parse(body.toString());
                        result[0].should.have.property('location');
                        result[0].should.have.property('name');
                        result[0].should.have.property('offers');
                        result[0].should.have.property('image');
                        result[0].should.have.property('fid');
                        result[0].offers.length.should.equal(1);
                        result[0].name.should.equal(all[3].name);
                      done();  
            });                    
                });
            });
        });

describe("testing typelist",function(){
       it("typelist=S1",function(done){
        this.timeout(10000);
        http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10&type=[\"S1\"]",function(res){
        res.on('data',function(body){
        var result=JSON.parse(body.toString());
        if(result[0].offers.length!=0)
        result[0].offers[0].type.should.equal("S1");
        result[0].should.have.property('location');
        result[0].should.have.property('name');
        result[0].should.have.property('offers');
        result[0].should.have.property('image');
        result[0].should.have.property('fid');
        result[0].offers.length.should.equal(1);
        done();
    });
});
       });
      it("typelist=S0",function(done){
        this.timeout(10000);
        http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10&type=[\"S0\"]",function(res){
        res.on('data',function(body){
        var result=JSON.parse(body.toString());
        if(result[0].offers.length!=0)
        result[0].offers[0].type.should.equal("S0");
        result[0].should.have.property('location');
        result[0].should.have.property('name');
        result[0].should.have.property('offers');
        result[0].should.have.property('image');
        result[0].should.have.property('fid');
        done();
    });
});
       }); 
      it("typelist=SX",function(done){
        this.timeout(10000);
        http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10&type=[\"SX\"]",function(res){
        res.on('data',function(body){
        var result=JSON.parse(body.toString());
        if(result[0].offers.length!=0)
        result[0].offers[0].type.should.equal("SX");
        result[0].should.have.property('location');
        result[0].should.have.property('name');
        result[0].should.have.property('offers');
        result[0].should.have.property('image');
        result[0].should.have.property('fid');
        done();
    });
});
       });
   });
describe("testing create function",function(done){
    it("should not work without latitude longitude image fid ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name="+settings.vendor.username,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without latitude longitude image fid name",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without latitude longitude image fid ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name="+settings.vendor.username+"&fid="+settings.vendor.fid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work without image ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name="+settings.vendor.username+"&fid="+settings.vendor.fid+"&latitude=10&longitude=10",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    }); 
    it("should not work without settings",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name="+settings.vendor.username+"&fid="+settings.vendor.fid+"&latitude=10&longitude=10&image="+settings.vendor.image,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                  result.result.should.equal(false); 
                    done();
                });
        });
    }); 
    it("should work with all params",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name="+settings.vendor.username+"&fid="+settings.vendor.fid+"&latitude=10&longitude=10&image="+settings.vendor.image+"&settings="+settings.gen.settings,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.data.name.should.equal(settings.vendor.username);
                  result.result.should.equal(true); 
                    done();
                });
        });
    })
 });
describe("testing getall function",function(done){
    it("should work without any params",function(done){
    this.timeout(10000);
    http.get(settings.core.server+"/vendor/get/all",function(res){
        res.on('data',function(body){
            var result=JSON.parse(body.toString());    
            models.Vendor.find({},function(err,data) {
            if(err) {
                console.log(err);
                return;
            }
            result.should.equal(data);
        });
            done();
        });
    });
});
});
describe("testing get function",function(done){
    it("should not work without vendor id",function(done){
        this.timeout(100000);
        http.get(settings.core.server+"/vendor/get",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should work with vendor id",function(done){
        this.timeout(100000);
        http.get(settings.core.server+"/vendor/get?vendor_id="+settings.gen.vendorid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.name.should.equal("Tuscana");
                result.fid.should.equal("7228");
                done();
            });
        });
    });
});
describe("testing addoffer function",function(done){
    it("should not work without vendor id offer id ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without vendor id  ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer?offer_id="+settings.vendor.offerid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without offer id  ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer?vendor_id="+settings.vendor.vendorid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                 result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work if the user is not admin ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer?vendor_id="+settings.vendor.vendorid+"&offer_id="+settings.vendor.offerid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                   done();
                });
        });
    });
    it("should work with all correct params",function(done){
        this.timeout(100000);
        http.get(settings.core.server+"/vendor/addoffer?vendor_id="+settings.dummy_vendor.vendorid+"&offer_id="+settings.vendor.offerid+"&access_token="+settings.dummy_vendor.access_token,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(true);
                done();
                });
        });
    });
    it("checking whether offer got added",function(done){
        this.timeout(1000000);
        var exists=false;
        http.get(settings.core.server+"/vendor/get?vendor_id="+settings.dummy_vendor.vendorid,function(res1){
                res1.on('data',function(body){
                    var result1=JSON.parse(body.toString());
                    for(var i=0;i<result1.offers.length;i++){
                        if(result1.offers[i]._id==settings.offerid)
                            exists=true;
                        if(i==result1.offers.length-1)
                        done1();
                    }
                });
                });
        function done1(){
        exists.should.equal(true);}
                 done();
    })
    
});
describe("testing upload policy",function(done){
    it("should not work without vendor id",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/upload-policy",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
                     });
        });
    });
    it("should not work without accesstoken",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/upload-policy?vendor_id="+settings.vendor.vendorid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
                     });
        });
    });
    it("should not work if user not admin or vendor",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/upload-policy?vendor_id="+settings.vendor.vendorid+"&access_token="+settings.gen.nonadminorvendor,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(false);                
                done();
                     });
        });
    });
   it("should work with all correct params",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/upload-policy?vendor_id="+settings.vendor.vendorid+"&access_token="+settings.admin.access_token,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(true);
                console.log(result);                
                done();
                     });
        });
    });
});
describe("testing get/visitedV2",function(done){
    it("should not work without access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/getvistedV2",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
    it("should work with access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/get/visitedV2?access_token="+settings.gen.useracctok,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(true);
                done();
            });
        });
    });
});
describe("testing get/visited",function(done){
    it("should not work without access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/get/visited",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
    it("should work with access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/get/visited?access_token="+settings.gen.useracctok,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(true);
                done();
            });
        });
    });
});
describe("testing vendorrequest",function(done){
    it("should not work without access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/request",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
    it("should work with access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/request?access_token="+settings.vendor.reqacctok+"&name=nothing&remarks=nothing",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(true);
                done();
            });
        });
    });
});
describe("testing updatesettings",function(done){
    it("should not work without vendor id",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/updatesettings",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work without access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/updatesettings?vendor_id="+settings.vendor.vendorid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work if the user is not admin or vendor",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/updatesettings?vendor_id="+settings.vendor.vendorid+"&access_token="+settings.gen.nonadminorvendor,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                   done();
                });
        });
    }); 
});
describe("testing update",function(done){
  it("should not work without vendor id",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/update",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    }); 
    it("should not work without access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/update?vendor_id="+settings.vendor.vendorid,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    }); 
    it("should not work if the user is not admin or vendor",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/update?vendor_id="+settings.vendor.vendorid+"&access_token="+settings.gen.nonadminorvendor,function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                   done();
                });
        });
    }); 
    it("should work for correct params",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/update?vendor_id="+settings.vendor.vendorid+"&access_token="+settings.admin.access_token+"&UUID=jascb&UUID=jbakc",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(true);
                   done();
                });
        });
    }); 
});
});
describe("testing offer.js",function(done){
    describe("testing get function",function(done){
        it("should work with offer_id",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/get?offer_id=54b03cba1752e1f403837038",function(res){
                res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(true);
                done();
            });
            });
        });
        it("should not work without offer_id",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/get",function(res){
                res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
            });
        });
    });
    describe("testing getmyoff",function(done){
        it("should not work without access_token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/getmyoff",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should work with access_token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/getmyoff?access_token=49cba97de9d025f5416a7db2295c11ca",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    console.log(result);
                    result.result.should.equal(true);
                    done();
                });
            });
        });
    });
    describe("testing create",function(done){
        it("should not work without access_token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/create",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should not work if the user is not admin",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/offer/create?access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(false);
                   done();
                });
        });
    });
      });
     describe("testing update",function(done){
        it("should not work without access_token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/update",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should not work without offer_id",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/update?access_token=04038c662a13aa753766cf4fd20570ad",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    //console.log(result);
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        
        it("should not work if the user is not admin",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/offer/update?access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(false);
                   done();
                });
        });
    });
      });
describe("testing delete",function(done){
            it("should not work without access_token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/offer/delete",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
            it("should not work if the user is not admin",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/offer/delete?access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(false);
                   done();
                });
        });
    });
             it("should not work without vendor id or offer id",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/offer/delete?access_token=04038c662a13aa753766cf4fd20570ad",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(false);
                   done();
                });
        });
    });
   it("should not work without vendor id ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/offer/delete?access_token=04038c662a13aa753766cf4fd20570ad&offer_id=54b03cba1752e1f403837038",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                debugger;
                result.result.should.equal(false);
                   done();
                });
        });
    });
   
});
describe("testing user.js",function(done){
    describe("testing facebooklogin",function(done){
        it("should not work without token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/login/facebook",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
    });
    describe("testing googlelogin",function(done){
        it("should not work without token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/login/google",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
    });
    describe("testing login/password",function(done){
        it("should not work without username or password",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/login/password",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should not work without username ",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/login/password?password=\"adcdefgh\"",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should not work without password ",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/login/password?username=\"adcdefgh\"",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        /*it("should work with params ",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/login/password?username=\"adcdefgh\"&password=\"adcdefgh\"",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    result.result.should.equal(true);
                    done();
                });
            });
        });*/
    });
   describe("testing reset/password",function(done){
        it("should not work without access_token",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/reset/password",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should not work without new_password",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/reset/password?access_token=db134037e1da7148ca8b30c355b89990",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
    });
   describe("testing create for vendoruser",function(done){
        it("should not work without vendor_id or username",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/create",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
        it("should not work without vendor_id ",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/create?username=\"abcdefgh\"",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
         it("should not work without username ",function(done){
            this.timeout(10000);
            http.get(settings.core.server+"/auth/create?vendor_id=54b03cba1752e1f4038370a9",function(res){
                res.on('data',function(body){
                    var result=JSON.parse(body.toString());
                    debugger;
                    result.result.should.equal(false);
                    done();
                });
            });
        });
    });
});
});
