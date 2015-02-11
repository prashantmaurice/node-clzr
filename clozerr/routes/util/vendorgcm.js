var mongoose=require('mongoose');
var db=mongoose.connection;
var GCMPush=require('./push.js');
var settings = require('../settings');
db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);

var GCMByVendor = function(vendor_fid,message){
    var User = Models.User;
    var user_list=[];
    User.find({},function(all_users){
        all_users.forEach(function(current,pos,arr){
            if(current.stamplist[vendor_fid]){
                user_list.push(current);
            }
        })
    });
    GCMPush.sendMultiPushNotification(user_list,message);
};

module.exports={
    sendGCMByVendor : GCMByVendor
}