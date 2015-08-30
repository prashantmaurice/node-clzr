var gcm = require("node-gcm-service");
var registry = global.registry;

var sendPushNotification=function( gcm_id, data ) {
  //debugger;
  gcm_parts = gcm_id.split("|:");
  console.log( gcm_parts );
  if( gcm_parts.length > 1 )
	gcm_id = gcm_parts[1];

  console.log("Sending push notif to :" + gcm_id);
  console.log(data);
  var message = new gcm.Message({
    collapse_key: 'clozerr',
    delay_while_idle: true,
    data: data
  });

  var sender = new gcm.Sender(); //Insert Google Server API Key
  sender.setAPIKey(registry.getSharedObject('settings').gcm.apiKey);
  var regIds = [];
  regIds.push( gcm_id ); //Insert Registration ID

  sender.sendMessage( message.toString(), regIds, true, function (err, res) {
    console.log(res);
    if (err) console.log(err);
  });

}
var sendMultiPushNotification=function(user_list,data){
    var regIds = [];
    user_list.forEach(function(current,pos,array) {
        var gcm_id=current.gcm_id;//TODO test
        console.log("Sending push notif to :" + gcm_id);
        console.log(data);
        regIds.push(gcm_id);
    });
    var message = new gcm.Message({
        collapse_key: 'clozerr',
        delay_while_idle: true,
        data: data
    });
    var sender = new gcm.Sender();
    sender.setAPIKey(registry.getSharedObject('settings').gcm.apiKey);
    sender.sendMessage(message.toString(), regIds, true, function (err, res) {
        console.log(res);
        if (err) console.log(err);
    });
}
module.exports ={
  sendPushNotification:sendPushNotification,
  sendMultiPushNotification: sendMultiPushNotification
}
registry.register("gcm",module.exports)
