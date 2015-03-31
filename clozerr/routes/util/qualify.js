var Vendor = models.Vendor;
var Offer = models.Offer;
var Checkin = models.CheckIn;
var User = models.User;

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
  });
  }

  function getFutureOffers(user, vendor_id, callback) {
    getAllOffers(vendor_id, function(vendor,allOffers) {
      var futureOffers = _.filter(allOffers, function(offer) {
        return (user.stamplist[vendor.fid] > offer.stamps)
      });
      callback(futureOffers, vendor);
    });
  }

  function getPastOffers(user, vendor_id, callback) {
    getAllOffers(vendor_id, function(vendor,allOffers) {
      var futureOffers = _.filter(allOffers, function(offer) {
        return (user.stamplist[vendor.fid] <= offer.stamps)
      });
      callback(futureOffers, vendor);
    });
  }

  function getUpcomingOffer(user, vendor_id, callback) {
    getFutureOffers(user, vendor_id, function(futureOffers, vendor) {
      if(futureOffers && futureOffers.length!=0) {
        callback(futureOffers[0], vendor);
      }
      else callback(null, vendor);
    });
  }

  function handleS1Offer(user, vendor, validate_data) {
    if( user.stamplist[vendor.fid] ) {
      user.stamplist[vendor.fid] ++;
    }
    else {
      user.stamplist[vendor.fid] = 1;
    }
    user.markModified("stamplist");
    user.save();
  }

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
}

function handleOffer(user, vendor_id, validate_data) {
  getUpcomingOffer(user, vendor_id, function(offer, vendor) {
    if(offer.type == "S1") {
      handleS1Offer(user, vendor, validate_data);
    }
    else if(offer.type == "SX") {
      handleSXOffer(user, vendor, validate_data);
    }
  });
}