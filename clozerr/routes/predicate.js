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

module.exports.qualify = function( user, vendor, offer ){

  console.log("Calculating: "+user._id + " " + vendor._id + " "+offer._id);
  //return true;
  console.log("Offer type: "+offer.type);
  debugger;
  if( !predicates[offer.type] ){
    /**
      TODO: Log an error here. we have an offer of unsupported type.
    **/
    return false;
  }
  return predicates[offer.type]( user, vendor, offer );
}
