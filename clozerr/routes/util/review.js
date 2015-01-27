
var push = require("./push");
// Review class.
module.exports = function( checkin, database ){
  debugger;
  this.checkin = checkin;
  this.request = function(){
    debugger;
    var self = this;

    console.log("Requesting review for ");
    console.log(checkin);

    var gcm_id = checkin.user.gcm_id;
    if( !gcm_id ){
      console.log("No GCMID, exiting");
      return;
    }
    console.log("Found GCMID: " + gcm_id);
    debugger;

    //var offsetTime = checkin.vendor.reviewOffset;
    //if(!offsetTime)
    //  offsetTime = 2000;
    console.log("Setting timeout.. ");
    setTimeout( function(){
      console.log("pushing");
      push.sendPushNotification( gcm_id, { type:"REVIEW", title:"Rate your experience", message:"Give us feedback on your visit to " + checkin.vendor.name + ".", "checkin_id":checkin._id, "vendor_id":checkin.vendor._id } );
    }, 2000);
  }
}
