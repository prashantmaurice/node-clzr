var settings = require("../settings");
var gcm = require("node-gcm");

module.exports ={
  sendPushNotification: function( gcm_id, data ) {
    //debugger;
    console.log("Sending push notif to :" + gcm_id);
    console.log(data);
    var message = new gcm.Message({
      collapseKey: 'validated',
      delayWhileIdle: true,
      data: data
    });

    var sender = new gcm.Sender(settings.gcm.apiKey); //Insert Google Server API Key
    var regIds = [];
    regIds.push( gcm_id ); //Insert Registration ID

    sender.send( message, regIds, 4, function (err, res) {
      console.log(res);
      if (err) console.log(err);
    });

  }
}
