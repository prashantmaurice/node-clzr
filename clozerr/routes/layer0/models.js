
var models = require("../models");

var registry = global.registry;

registry.register("models_User", models.User);
registry.register("models_Vendor", models.Vendor);
registry.register("models_Offer", models.Offer);
registry.register("models_Checkin", models.CheckIn);
registry.register("models_Token",models.Token);
// register other models here.
