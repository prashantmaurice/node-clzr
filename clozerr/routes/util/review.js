
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
      return;
    }
    var offsetTime = checkin.vendor.reviewOffset;
    if(!offsetTime)
      offsetTime = 2000;

    setTimeout( function(){
      console.log("pushing");
      push.sendPushNotification( checkin.user, { type:"REVIEW", title:"Rate your experience", message:"Give us feedback on your visit to " + checkin.vendor.name + "." } );
    }, offsetTime);
  }
}
