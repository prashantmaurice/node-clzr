var registry = global.registry;

var policyCheckTimeDelayBetweenCheckins = function( user, vendor, offer ) {


  return CheckIn.findOne( { user:user._id, vendor:vendor._id, state:CHECKIN_STATE_CONFIRMED} ).sort("date_created").exec().then(function( checkin ){
    var deferred = Q.defer();
    debugger;

    if( !checkin ){
      process.nextTick( function(){
        deferred.resolve( true );
    });
      return deferred.promise;
  }


  if( Math.abs( new Date().getTime() - checkin.date_created.getTime() ) < settings.checkin.delay_between_checkins ) {
      process.nextTick( function(){
        deferred.resolve( false );
    });
  }
  else{
      process.nextTick( function(){
        deferred.resolve( true );
    });
  }

  return deferred.promise;

});

}

var policyCheckDuplicateCheckins = function( user, vendor, offer ) {


  return CheckIn.findOne( { user:user._id, vendor:vendor._id, offer:offer._id, state:CHECKIN_STATE_ACTIVE} ).exec().then(function( checkin ){
    var deferred = Q.defer();
    debugger;
    if( checkin ) {
      process.nextTick( function(){
        deferred.resolve( checkin );
    });
  }
  else{
      process.nextTick( function(){
        deferred.resolve( );
    });
  }

  return deferred.promise;

});

}

var getVendorNearDisplay=function(vendor){
  var retVendor={
    _id:vendor._id||0,
    name:vendor.name||0,
    address:vendor.address||0,
    visible:vendor.visible||0,
    settings:vendor.settings||{}
  };
  return retVendor;
}

module.exports = {
  getVendorNearDisplay:getVendorNearDisplay,
  policyCheckTimeDelayBetweenCheckins:policyCheckTimeDelayBetweenCheckins,
  policyCheckDuplicateCheckins:policyCheckDuplicateCheckins
}

registry.register("util", module.exports);