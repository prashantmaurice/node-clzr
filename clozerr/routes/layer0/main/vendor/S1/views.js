var registry = global.registry;
var Q = require("q");

var view_vendor_offers_offerPage_S1 = function( params){

 console.log('in view_vendor_offers_offerPage_S1');
 var vendorObjectData = registry.getSharedObject("data_vendor_S1");
 var deferred = Q.defer();
 debugger;
 var plist=[];
 plist.push(registry.getSharedObject("data_vendor").get(params).then(function(vendor){
  vendorObj=vendor;
 }));
 plist.push(registry.getSharedObject("util_session").get(params).then(function(user){
    userObj=user;
 }));
 Q.all(plist).then(function(){
 vendor = JSON.parse(JSON.stringify(vendorObj));

 debugger;
 vendorObjectData.get(params, vendorObj).then(function(vendor) {
    //console.log(vendor);
    console.log(user);
    debugger;

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
});});
 return deferred.promise;
}

registry.register('view_vendor_offers_offersPage_S1', {get:view_vendor_offers_offerPage_S1});

var view_vendor_homepage_S1 = function( params, vendor, user ){
    /*
     * Calculate the required offer and place it in vendor.offer
     * Use any means necessary. use special properties in the vendor if necessary
     * This method abstracts the technique from the requirement.
     * We could get all the vendors offers here and sort them by stamplist.
     * Or we might store the stamplist pre-ordered by stamps here and only fetch that offer. 
     */

 }
