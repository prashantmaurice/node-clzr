var models = require("../models");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Checkin = models.CheckIn;
var User = models.User;
var _ = require("underscore");

function stampCount(vendor,offer){

  if(offer.type=="S1") return (offer.stamps*1);
  else if(vendor.settings) return (offer.stamps*1)+((vendor.settings.SXLimit||10)*1);
  else return (offer.stamps*1)+((10)*1);
}
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
    });
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
  }*/
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
}*/

function getVendorPageDisplay(user, vendor_id, callback) {
  getHomePageVendorDisplay(user, vendor_id, function(vendor, vendorDisplay) {
    vendorDisplay.phone = vendor.phone;
    vendorDisplay.description = vendor.description;
    callback(vendor, vendorDisplay);
  });
}

module.exports={getAllOffers:getAllOffers,
  handleOffer:handleOffer,
  handleSXOffer:handleSXOffer,
  handleS1Offer:handleS1Offer,
  getPastOffers:getPastOffers,
  getUpcomingOffer:getUpcomingOffer,
  getOfferDisplay:getOfferDisplay,
  getVendorPageDisplay:getVendorPageDisplay,
  getFutureOffers:getFutureOffers};
