var models = require("../models");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Checkin = models.CheckIn;
var User = models.User;
var _ = require("underscore");
var Q = require("q");

textToImage = {
  "0" : "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/256/Letter-U-icon.png",
  "1" : "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/256/Letter-N-icon.png",
  "2" : "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/256/Letter-L-icon.png"
}

function stampCount(vendor,offer){

  if(offer.type=="S1") return (offer.stamps*1);
  else if(vendor.settings) return (offer.stamps*1)+((vendor.settings.SXLimit||10)*1);
  else return (offer.stamps*1)+((10)*1);
}

var assignFlagsToOffer = function(user, vendor) {
  var offers = JSON.parse(JSON.stringify(vendor.offers));
  var offersFuture = [];
  var deferred = Q.defer();
  for(var i=0;i<offers.length; i++) {
    debugger;
    if(!user.stamplist[vendor.fid]) {
      user.stamplist[vendor.fid] = 0;
      user.save();
    }
    if(user.stamplist[vendor.fid] < stampCount(vendor, offers[i])) {
      var offer = offers[i];
      offer.flagState = "2";
      offersFuture.push(offer);
    }
    else if(user.stamplist[vendor.fid] >= stampCount(vendor, offers[i])) {
      offers[i].flagState = "0";
      console.log("USED");
    }
  }
  _.sortBy(offersFuture, function(index, element, array) {
    return stampCount(vendor, element);
  });
  debugger;
  console.log(offersFuture);
  console.log(offers);
  if(offersFuture.length) {
    offersFuture[0].flagState = "1";
  }
  offers.concat(offersFuture);
  debugger;
  deferred.resolve(offers);
  debugger;
  return deferred.promise;
}

var getCheckinOnCheckinDisplay = function(checkin) {
  return checkin;
}

var getCheckinOnValidateDisplay = function(checkin) {
  return checkin;
}

var getOfferDisplay = function (user, vendor, offer, checkinOld){
  var offerDisplay={};
  var deferred = Q.defer();
  if(offer) {
    debugger;
    console.log(user.stamplist[vendor.fid]);

    offerDisplay._id=offer._id;
    offerDisplay.type=offer.type;
    offerDisplay.caption=offer.caption;
    offerDisplay.description=offer.description;
    // offerDisplay.stamps=offer.stamps*1;
    offerDisplay.params={};
    debugger;

    if(checkinOld) {
      offerDisplay.params.used = true;
    }
    else {
      offerDisplay.params.used = false;
    }

    if(offerDisplay.stamps*1 <= user.stamplist[vendor.fid]*1) {
      offerDisplay.params.unlocked = true;
    }
    else {
      offerDisplay.params.unlocked = false;
    }
    if(offerDisplay.type=="S1") {
      offerDisplay.params.stamps=offer.stamps*1;
    }
    if(offerDisplay.type=="SX") {
      offerDisplay.params.stamps=offer.stamps*1;
      offerDisplay.stampStatus = {};
      offerDisplay.params.billAmt = vendor.settings.billAmt*1;
      if(user.stamplist[vendor.fid]*1 > offer.stamps*1) {
        offerDisplay.stampStatus.current = (user.stamplist[vendor.fid]*1) % vendor.settings.SXLimit;
      }
      else {
        offerDisplay.stampStatus.current = 0;
      }
      offerDisplay.stampStatus.total = vendor.settings.SXLimit*1;
    }
    if(offerDisplay.type=="S0") {    
      offerDisplay.params=offer.params
    }
    deferred.resolve(offerDisplay);
  }
  else {
    deferred.resolve(null);
  };

  return deferred.promise;
}

/*

function getAllOffers(vendor_id,callback) {
  Vendor.findOne({
    _id: vendor_id
  }, function (err, vendor) {
    if (err) {
      console.log(err);
      return;
    }
    Offer.find({
      _id: {
        $in: vendor.offers
      }
    }, function (err, offers) {
      if(err) {
        console.log(err);
        return;
      }
      callback(vendor,offers);
    }
    );
  });
}

function getFutureOffers(user, vendor_id, callback) {
  getAllOffers(vendor_id, function(vendor,allOffers) {
    var futureOffers = _.filter(allOffers, function(offer) {
      return (user.stamplist[vendor.fid] < stampCount(vendor,offer))
    });
    futureOffers = _.sortBy(futureOffers,function(offer){return stampCount(vendor,offer)});
    callback(futureOffers, vendor);
  });
}

function getPastOffers(user, vendor_id, callback) {
  getAllOffers(vendor_id, function(vendor,allOffers) {
    var pastOffers = _.filter(allOffers, function(offer) {
      if(!user.stamplist[vendor.fid])
        user.stamplist[vendor.fid] = 0;
      return (user.stamplist[vendor.fid] >= stampCount(vendor,offer))
    });
 /*   _.each(pastOffers, function(element, array, index) {
      pastOffers[index].flagState = "used";
      if(index == array.length - 1) {
        callback(pastOffers, vendor);
      }
    });*/
  /*for(var index=0;index<pastOffers.length;index++) {
    pastOffers[index].flagState = "used";
  }
  callback(pastOffers, vendor);
});
}

function getUpcomingOffer(user, vendor_id, callback) {
  getFutureOffers(user, vendor_id, function(futureOffers, vendor) {
    futureOffers[0].flagState = "upcoming";
    if(futureOffers && futureOffers.length!=0) {
      callback(futureOffers[0], vendor);
    }
    else callback(null, vendor);
  });
}

function handleS1Offer(user, vendor, offer,validate_data) {
  if( user.stamplist[vendor.fid] ) {
    user.stamplist[vendor.fid] ++;
  }
  else {
    user.stamplist[vendor.fid] = 1;
  }
  user.markModified("stamplist");
  user.save();
}

function handleSXOffer(user, vendor, offer,validate_data) {
  if( user.stamplist[vendor.fid] ){
    if(user.stamplist[vendor.fid] +parseInt(validate_data.stamps)>((vendor.settings.SXLimit)?vendor.settings.SXLimit:10)+offer.stamps){
      user.stamplist[vendor.fid]=((vendor.settings.SXLimit)?vendor.settings.SXLimit:10)+offer.stamps;
    } else {
      user.stamplist[vendor.fid] +=parseInt(validate_data.stamps);
    }
  }
  else {
    if(parseInt(validate_data.stamps)>((vendor.settings.SXLimit)?vendor.settings.SXLimit:10)+offer.stamps){
      user.stamplist[vendor.fid]=((vendor.settings.SXLimit)?vendor.settings.SXLimit:10)+offer.stamps;
    } else {
      user.stamplist[vendor.fid] =parseInt(validate_data.stamps);
    }
  }
  user.markModified("stamplist");
  user.save();
}

function handleOffer(user, vendor_id, validate_data) {
  getUpcomingOffer(user, vendor_id, function(offer, vendor) {
    if(offer.type == "S1") {
      handleS1Offer(user, vendor, offer,validate_data);
    }
    else if(offer.type == "SX") {
      handleSXOffer(user, vendor, offer,validate_data);
    }
  });
}

function getOfferDisplay(user, vendor, offer, flagState){
  var offerDisplay={};
  if(offer) {
    offerDisplay.type=offer.type;
    offerDisplay.image=flagState;//TODO
    offerDisplay.optionalImage=null;//TODO
    offerDisplay.caption=offer.caption;
    offerDisplay.description=offer.description;
    offerDisplay.stamps=offer.stamps*1;

    if(offerDisplay.type=="SX") {
      offerDisplay.stampStatus = {};
      offerDisplay.billAmt = vendor.settings.billAmt*1;
      if(user.stamplist[vendor.fid] > offer.stamps) {
        offerDisplay.stampStatus.current = (user.stamplist[vendor.fid]*1) % vendor.settings.SXLimit;
      }
      else {
        offerDisplay.stampStatus.current = 0;
      }
      offerDisplay.stampStatus.total = vendor.settings.SXLimit*1;
    }    
    return offerDisplay;
  }
  else return null;
}

/*function getHomePageVendorDisplay(user, vendor_id, callback1) {

  console.log(callback1);
  console.log(user._id);
  console.log(vendor_id);
  getUpcomingOffer(user, vendor_id, function (offer, vendor) {
   var vendorDisplay = {};
   vendorDisplay.name = vendor.name;
   vendorDisplay.location = vendor.location;
   vendorDisplay.image = vendor.image;
   vendorDisplay.currentOfferDisplay = getOfferDisplay(user, vendor, offer);
   callback1(vendorDisplay);
 });
}*/
/*
function getHomePageDisplay(user, vendors, callback) {

  var vendorDisplays = [];

  for(var i=0;i<vendors.length;i++) {
    getUpcomingOffer(user, vendors[i]._id, function (offer, vendor) {
      var vendorDisplay = {};
      vendorDisplay.name = vendor.name;
      vendorDisplay.location = vendor.location;
      vendorDisplay.image = vendor.image;
      vendorDisplay.currentOfferDisplay = getOfferDisplay(user, vendor, offer);

      vendorDisplays[i] = vendorDisplay;
    });
  }
  //return vendorDisplays;
  callback(vendorDisplays);
}

function getVendorPageDisplay(user, vendor_id, callback) {
  getHomePageVendorDisplay(user, vendor_id, function(vendor, vendorDisplay) {
    vendorDisplay.phone = vendor.phone;
    vendorDisplay.description = vendor.description;
    callback(vendor, vendorDisplay);
  });
}
*/
module.exports={
  assignFlagsToOffer:assignFlagsToOffer,
  getOfferDisplay:getOfferDisplay,
  getCheckinOnCheckinDisplay:getCheckinOnCheckinDisplay,
  getCheckinOnValidateDisplay:getCheckinOnValidateDisplay};

  var registry = global.registry;
registry.register("qualify", module.exports)
