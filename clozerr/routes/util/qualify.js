
var models = require("../models");
var Vendor = models.Vendor;
var Offer = models.Offer;
var Checkin = models.CheckIn;
var User = models.User;
var _ = require("underscore");

function stampCount(vendor,offer){
    if(offer.type=="S1") return offer.stamps;
    else return (offer.stamps*1)+(vendor.settings.SXLimit*1);
}
>>>>>>> c362929879c9b91fd475b94213595585b887f158
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
<<<<<<< HEAD
    }
=======
    });
>>>>>>> c362929879c9b91fd475b94213595585b887f158
  });
  }

  function getFutureOffers(user, vendor_id, callback) {
    getAllOffers(vendor_id, function(vendor,allOffers) {
      var futureOffers = _.filter(allOffers, function(offer) {
<<<<<<< HEAD
        return (user.stamplist[vendor.fid] > offer.stamps)
=======
        return (user.stamplist[vendor.fid] < stampCount(vendor,offer))
>>>>>>> c362929879c9b91fd475b94213595585b887f158
      });
      callback(futureOffers, vendor);
    });
  }

  function getPastOffers(user, vendor_id, callback) {
    getAllOffers(vendor_id, function(vendor,allOffers) {
<<<<<<< HEAD
      var futureOffers = _.filter(allOffers, function(offer) {
        return (user.stamplist[vendor.fid] <= offer.stamps)
=======
      console.log(allOffers);
      var futureOffers = _.filter(allOffers, function(offer) {
        console.log("stampcount");
        console.log(stampCount(vendor,offer));
        return (user.stamplist[vendor.fid] >= stampCount(vendor,offer))
>>>>>>> c362929879c9b91fd475b94213595585b887f158
      });
      callback(futureOffers, vendor);
    });
  }

  function getUpcomingOffer(user, vendor_id, callback) {
    getFutureOffers(user, vendor_id, function(futureOffers, vendor) {
      if(futureOffers && futureOffers.length!=0) {
<<<<<<< HEAD
=======
          _.sortBy(futureOffers,function(offer){return stampCount(vendor,offer)});
>>>>>>> c362929879c9b91fd475b94213595585b887f158
        callback(futureOffers[0], vendor);
      }
      else callback(null, vendor);
    });
  }

<<<<<<< HEAD
  function handleS1Offer(user, vendor, validate_data) {
=======
  function handleS1Offer(user, vendor, offer,validate_data) {
>>>>>>> c362929879c9b91fd475b94213595585b887f158
    if( user.stamplist[vendor.fid] ) {
      user.stamplist[vendor.fid] ++;
    }
    else {
      user.stamplist[vendor.fid] = 1;
    }
    user.markModified("stamplist");
    user.save();
  }

<<<<<<< HEAD
  function handleSXOffer(user, vendor, validate_data) {
    if( user.stamplist[vendor.fid] ){
      user.stamplist[vendor.fid] += parseInt(validate_data.stamps);
    }
    else
      user.stamplist[vendor.fid] = parseInt(validate_data.stamps);
    user.markModified("stamplist");
  }
  user.markModified("stamplist");
  user.save();
=======
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
>>>>>>> c362929879c9b91fd475b94213595585b887f158
}

function handleOffer(user, vendor_id, validate_data) {
  getUpcomingOffer(user, vendor_id, function(offer, vendor) {
    if(offer.type == "S1") {
<<<<<<< HEAD
      handleS1Offer(user, vendor, validate_data);
    }
    else if(offer.type == "SX") {
      handleSXOffer(user, vendor, validate_data);
    }
  });
}
=======
      handleS1Offer(user, vendor, offer,validate_data);
    }
    else if(offer.type == "SX") {
      handleSXOffer(user, vendor, offer,validate_data);

    }
  });
}

function getOfferDisplay(offer){
    var offerDisplay={};
    offerDisplay.image=null;//todo
    offerDisplay.caption=offer.caption;
    offerDisplay.description=offer.description;
    offerDisplay.stamps=offer.stamps;
    return offerDisplay;
}

module.exports={getAllOffers:getAllOffers,
                handleOffer:handleOffer,
                handleSXOffer:handleSXOffer,
                handleS1Offer:handleS1Offer,
                getPastOffers:getPastOffers,
                getUpcomingOffer:getUpcomingOffer,
                getFutureOffers:getFutureOffers};
>>>>>>> c362929879c9b91fd475b94213595585b887f158
