module.exports = {};

var predicates = {
  "S1": function( user, vendor, offer ){
    console.log("Evaluating S1");
    if( user.stamplist && user.stamplist[vendor.fid] && user.stamplist[vendor.fid] == parseInt( offer.stamps ) )
      return true;
    else if( user.stamplist && !user.stamplist[vendor.fid] && offer.stamps == "1" )
      return true;
    else
      return false;

  },

  "S0": function( user, vendor, offer ){
    return true;
  },

  "SX": function( user, vendor, offer ){
    var temp = parseInt( offer.stamps );

    if( user.stamplist && (user.stamplist[vendor.fid]>=temp))
      return true;
    else
      return false;

  }
};

var handlers = {
  "S1": function( user, vendor, offer ){
    debugger;
    console.log("Setting: " + vendor.fid + " of stamplist");
    user.markModified("stamplist");
    if( user.stamplist[vendor.fid] )
      user.stamplist[vendor.fid] ++;
    else
      user.stamplist[vendor.fid] = 0;
  },
  "S0": function( user, vendor, offer) {
    if( !user.stamplist[vendor.fid] )
      user.stamplist[vendor.fid] = 0;
  },
  "SX": function( user, vendor, offer) {
    if( user.stamplist[vendor.fid] )
      user.stamplist[vendor.fid] += parseInt(offer.stamps);
    else
      user.stamplist[vendor.fid] = 0;
  }
}
module.exports.qualify = function( user, vendor, offer ){


  debugger;
  console.log("Calculating: "+user._id + " " + vendor._id + " "+offer._id);
  console.log("Offer type: "+offer.type);
  debugger;
  if( !predicates[offer.type] ){
    console.log("Type of offer is unsupported");
    return false;
  }
  return predicates[offer.type]( user, vendor, offer );
}

module.exports.onCheckin = function( user, vendor, offer ){

  debugger;
  console.log("Checking in: "+user._id + " " + vendor._id + " "+offer._id);
  console.log("Offer type: "+offer.type);
  debugger;
  if( !handlers[offer.type] ){
    console.log("Type of offer is unsupported");
    return false;
  }
  return handlers[offer.type]( user, vendor, offer );
}
