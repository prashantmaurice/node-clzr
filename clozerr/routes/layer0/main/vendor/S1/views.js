var registry = global.registry;
var Q = require("q");

var view_vendor_offers_offerPage_S1 = function( params, vendor, user ){

 console.log('in view_vendor_offers_offerPage_S1');
 var vendorObjectData = registry.getSharedObject("data_vendor_S1");
 var deferred = Q.defer();

 vendor = JSON.parse(JSON.stringify(vendor));

 debugger;
 vendorObjectData.get(params, vendor).then(function(vendor) {
    //console.log(vendor);
    console.log(user);

    registry.getSharedObject("qualify").assignFlagsToOffer(user, vendor).then(function(offers) {
        var plist = [];
        var offersview = [];
        for(var i=0;i<offers.length;i++) {
            var pr = registry.getSharedObject("qualify").getOfferDisplay(user, vendor, offers[i])
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
});
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
