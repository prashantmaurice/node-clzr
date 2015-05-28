var registry = global.registry;
var Q = require("q");

var vendor_checkin_S1 = function( params, user, vendor, offer ){
    var deferred = Q.defer();

    var checkinM = registry.getSharedObject("data_checkin");
    var checkinObj = checkinM.create();

    //TODO : Also if the checkin is not validated within 2 hrs, just cancel it i.e set its state to cancelled and save it

    util.policyCheckDuplicateCheckins(user, vendor, offer).then(function(checkin) {
        if(checkin) {
            deferred.resolve(checkin);
        }
        else {
            util.policyCheckTimeDelayBetweenCheckins(user, vendor, offer).then(function(retval, checkin) {
                if(retval) {
                    checkinObj.vendor = params.vendor_id;
                    checkinObj.user = user._id;
                    checkinObj.offer = params.offer_id;
                    checkinObj.state = CHECKIN_STATE_ACTIVE;

                    checkinM.save( checkinObj ).then( function( checkin ){
                        deferred.resolve( checkin );
                    }, function( err ){
                        deferred.reject( err );
                    });
                }
                else {
                        //TODO : throw error here.. can't use that offer
                        //deferred.reject(err);
                }
            }, function(err) {
                deferred.reject(err);
            });
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

var vendor_predicate_S1 = function(user, vendor, offer) {
    var deferred = Q.defer();

    if(user.stamplist[vendor.fid]) {
        user.stamplist[vendor.fid] = 0;
        user.save();
    }

    if(user.stamplist[vendor.fid] >= offer.stamps) {
        deferred.resolve(true);
    }
    else {
        deferred.resolve(false);
    }

    return deferred.promise;
}

var vendor_validate_S1 = function( params, vendor, user, checkin ){
    var deferred = Q.defer();

    //TODO : Put a review scheduler for sending review push notification after some preset time delay

    //increase stamps
    
    user.stamplist[vendor.fid]++;
    user.save();

    var checkinM = registry.getSharedObject("data_checkin");
    checkinM.get( params ).then( function( checkin ){
        checkin.state = CHECKIN_STATE_CONFIRMED;
        return checkinM.save(params, checkin);
    }, function( err ){
        deferred.reject( err );
    }). then( function( checkin ){
        deferred.resolve( checkin );
    }, function( err ){
        deferred.reject( err );
    });

    return deferred.promise;
}

global.registry.register("handler_checkin_S1", {get:vendor_checkin_S1});
global.registry.register("handler_validate_S1", {get:vendor_validate_S1});
global.registry.register("handler_predicate_S1", {get:vendor_predicate_S1});
