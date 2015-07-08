
var http_vendor_offers_offerPage_SX = function( params, vendor, user ){
    var vendorObjectData = registry.getSharedObject("http_vendor_SX");
    vendorObjectData.get( params, vendor ).then( function( vendor ){
    
    /*
     * Implement SX type vendor's my offers page return.
     */

    }, function( user ){
    
    } );
}

var view_vendor_offers_offerPage_SX = function( params){

 console.log('in view_vendor_offers_offerPage_SX');
 var vendorObjectData = registry.getSharedObject("data_vendor_SX");
 var deferred = Q.defer();
 debugger;
 var plist=[];

 plist.push(registry.getSharedObject("data_vendor").get(params).then(function(vendor){
  vendorObj=vendor;
}));
 plist.push(registry.getSharedObject("live_session").get(params).then(function(user){
  userObj=user;
}));
 Q.all(plist).then(function(){
   vendor = JSON.parse(JSON.stringify(vendorObj));

   debugger;
   vendorObjectData.get(params, vendorObj).then(function(vendor) {
    //console.log(vendor);
    debugger;
    //console.log(userObj);

    registry.getSharedObject("qualify").assignFlagsToOffer(userObj, vendor).then(function(offers) {
      plist = [];
      var offersview = [];

      debugger;

        //removing the dummy visit offer from the offersview

        var visitOffer = _.find(offers, function(offer) {
          return (offer._id == vendor.visitOfferId);
        });
        var index = offers.indexOf(visitOffer);

        if(index > -1) {
          offers.splice(index, 1);
        }

        debugger;
        
        for(var i=0;i<offers.length;i++) {
          var pr = registry.getSharedObject("qualify").getOfferDisplay(userObj, vendor, offers[i])
          .then(function(offer) {
            debugger;
            offersview.push(offer);
            console.log(i);
          });
          plist.push(pr);
        }
        Q.all(plist).then(function() {
          console.log('q.all');
          console.log(offersview);
          vendor.offers = offersview;
          deferred.resolve(vendor);
        });
      });
  }, function(err) {
    debugger;
    deferred.resolve({code:500,error:err});
  });
}, function(err) {
  deferred.resolve({code:500,error:err});
});
return deferred.promise;
}

registry.register('view_vendor_offers_offersPage_SX', {get:view_vendor_offers_offerPage_SX});
