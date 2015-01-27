var settings = require("../settings");
var gcm = require("node-gcm-service");

module.exports ={
  sendPushNotification: function( gcm_id, data ) {
    //debugger;
    console.log("Sending push notif to :" + gcm_id);
    console.log(data);
    var message = new gcm.Message({
      collapse_key: 'clozerr',
      delay_while_idle: true,
      data: data
    });

    var sender = new gcm.Sender(); //Insert Google Server API Key
    sender.setAPIKey(settings.gcm.apiKey);
    var regIds = [];
    regIds.push( gcm_id ); //Insert Registration ID

    sender.sendMessage( message.toString(), regIds, true, function (err, res) {
      console.log(res);
      if (err) console.log(err);
    });

  }
}
