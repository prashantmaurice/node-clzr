module.exports = {};

var _ = require('underscore');
var Q = require('q');

var predicates = {
  "S1": function( user, vendor, offer ){

    if( user.stamplist && user.stamplist[vendor.fid] && user.stamplist[vendor.fid] == parseInt( offer.stamps ) - 1 )
      return true;
    else if( user.stamplist && !user.stamplist[vendor.fid] && offer.stamps == "1" )
      return true;
    else
      return false;
  },

  "S0": function( user, vendor, offer ){
    predicatesS0[offer.params.type](user, vendor, offer).then(function(retval) {
      debugger;
      return retval;
    })

  },

  "SX": function( user, vendor, offer ){
    var temp = parseInt( offer.stamps );
    if(!user.stamplist)
      return false
    return (user.stamplist[vendor.fid]>=temp)
  }
};

var predicatesS0 = {
  "limitedTime": function( user, vendor, offer) {
   var currentDate = new Date();
   var deferred = Q.defer();

   if(currentDate > offer.params.offerStart && currentDate < offer.params.offerEnd) {
    debugger;
    return true;
  }
  else {
    debugger;
    return false;
  }
},
"limitedCustomers": function( user, vendor, offer) {
  var Checkin = require("./models").CheckIn;
  var deferred = Q.defer();
  Checkin.find({
    offer:offer._id
  }).exec().then(function(err, allCheckins) {

    if(allCheckins.length >= offer.params.maxCustomers) {
      deferred.resolve(false);
    }
      //maximum number of checkins is fixed by the vendor - maximum number of customers
      else {
        var checkinsByUser = _.filter(allCheckins, function(checkin) {
          return (checkin.user == user._id);
        });
        //user has not used the offer already
        if(checkinsByUser.length == 0) {
          deferred.resolve(true);
        }
        else {
         deferred.resolve(false);
       }
     }
   });
  return deferred.promise;
}
}

var handlers = {
  "S1": function( user, vendor, offer ){

    if( user.stamplist[vendor.fid] )
      user.stamplist[vendor.fid] ++;
    else
      user.stamplist[vendor.fid] = 1;
    user.markModified("stamplist");
  },
  "S0": function( user, vendor, offer) {
    if( !user.stamplist[vendor.fid] )
      user.stamplist[vendor.fid] = 0;
  },
  "SX": function( user, vendor, offer, validate_data ) {
    if( user.stamplist[vendor.fid] ){
      user.stamplist[vendor.fid] += parseInt(validate_data.stamps);
    }
    else
      user.stamplist[vendor.fid] = parseInt(validate_data.stamps);
    user.markModified("stamplist");
  }
}
module.exports.qualify = function( user, vendor, offer ){
  if( !predicates[offer.type] ){
    console.log("Type of offer is unsupported");
    return false;
  }
  return predicates[offer.type]( user, vendor, offer );
}

module.exports.onCheckin = function( user, vendor, offer, validate_data ){
  if( !handlers[offer.type] ){
    console.log("Type of offer is unsupported");
    return false;
  }
  return handlers[offer.type]( user, vendor, offer, validate_data );
}
