var Q = require("q");
var registry = global.registry;
var ObjectId = require('mongoose').Types.ObjectId;
var Vendor=registry.getSharedObject("models_Vendor");

var data_nearbyvendors_list=function(params)
{debugger;
	var deferred=Q.defer();
	var  lat=params.latitude;
    var  lon=params.longitude;
    var offset=0;
    var limit=50;
    Vendor.find({
          location: {
            $near: [lat, lon]
          },
          visible:true
        }).limit(limit).skip( offset ).exec().then(function (vendors) {
          debugger;
           deferred.resolve(vendors); 
        },function(err){
        	deferred.resolve({code:500,error:err});
        });
        return deferred.promise;
}
registry.register("data_nearbyvendors_list",{get:data_nearbyvendors_list});

