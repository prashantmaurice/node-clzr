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
describe("testing typelist",function(){
       it("typelist=S1",function(done){
        this.timeout(10000);
        http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10&type=[\"S1\"]",function(res){
        res.on('data',function(body){
        var result=JSON.parse(body.toString());
        //console.log(result);
        done();
    });
});
       });
      it("typelist=S0",function(done){
        this.timeout(10000);
        http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10&type=[\"S0\"]",function(res){
        res.on('data',function(body){
        var result=JSON.parse(body.toString());
       //console.log(result);
        done();
    });
});
       }); 
      it("typelist=SX",function(done){
        this.timeout(10000);
        http.get(settings.core.server + "/vendor/get/near?latitude=10&longitude=10&type=[\"SX\"]",function(res){
        res.on('data',function(body){
        var result=JSON.parse(body.toString());
       //console.log(result);
        done();
    });
});
       });
   });
describe("testing create function",function(done){
    it("should not work without latitude longitude image fid ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name=\"testvendor\"",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
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
                //console.log(result);
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without latitude longitude image fid ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name=\"testvendor\"&fid=1234",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                 result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work without image ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name=\"testvendor\"&fid=1234&latitude=10&longitude=10",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work if the user is not admin ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/create?name=\"testvendor\"&fid=1234&latitude=10&longitude=10&image=\"testimage\"&access_token=3dabb3a3ff67abb935fd3fe59988dc82",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                  //console.log(result);  
                  result.result.should.equal(false); 
                    done();
                });
        });
    }); 
 });
describe("testing getall function",function(done){
    it("should without any params",function(done){
    this.timeout(10000);
    http.get(settings.core.server+"/vendor/get/all",function(res){
        res.on('data',function(body){
            var result=JSON.parse(body.toString());
            //console.log(result);
            done();
        });
    });
});
});
describe("testing get function",function(done){
    it("should not work without vendor id",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/get",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                 result.result.should.equal(false);
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
                //console.log(result);
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without vendor id  ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer?offer_id=54b03cba1752e1f40383705b",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                 result.result.should.equal(false);
                done();
            });
        });
    });
    it("should not work without offer id  ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer?vendor_id=54b03cba1752e1f40383705b",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                 result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work if the user is not admin ",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/addoffer?vendor_id=54b03cba1752e1f40383705b&offer_id=54b03cba1752e1f40383705b",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                   done();
                });
        });
    }); 
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
        http.get(settings.core.server+"/vendor/upload-policy?vendor_id=54b03cba1752e1f403837097",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                result.result.should.equal(false);
                done();
                     });
        });
    });
    it("should not work if user not admin or vendor",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/upload-policy?vendor_id=54b03cba1752e1f403837097&access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                result.result.should.equal(false);
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
        http.get(settings.core.server+"/vendor/get/visitedV2?access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
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
        http.get(settings.core.server+"/vendor/get/visited?access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
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
   /* it("should work with access_token",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/request?access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                //console.log(result);
                result.result.should.equal(true);
                done();
            });
        });
    });*/
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
        http.get(settings.core.server+"/vendor/updatesettings?vendor_id=54b03cba1752e1f403837097",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    });
     it("should not work if the user is not admin or vendor",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/updatesettings?vendor_id=54b03cba1752e1f40383705b&access_token=db134037e1da7148ca8b30c355b89990",function(res){
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
        http.get(settings.core.server+"/vendor/update?vendor_id=54b03cba1752e1f403837097",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                done();
            });
        });
    }); 
    it("should not work if the user is not admin or vendor",function(done){
        this.timeout(10000);
        http.get(settings.core.server+"/vendor/updatesettings?vendor_id=54b03cba1752e1f40383705b&access_token=db134037e1da7148ca8b30c355b89990",function(res){
            res.on('data',function(body){
                var result=JSON.parse(body.toString());
                result.result.should.equal(false);
                   done();
                });
        });
    }); 
});
});
