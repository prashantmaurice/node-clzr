
var models = require("../models");

var registry = global.registry;

registry.register("models_User", models.User);
registry.register("models_Vendor", models.Vendor);
registry.register("models_Offer", models.Offer);
registry.register("models_Checkin", models.CheckIn);
registry.register("models_Token",models.Token);
registry.register("models_Review", models.Review);
registry.register("models_Tag", models.Tag);
global.registry.register("models_Geofence", models.Geofence);
// register other models here.
