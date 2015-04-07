
var models = require("../models");

var registry = globals.registry;

registry.register("models_User", models.User);
registry.register("models_Vendor", models.Vendor);
registry.register("models_Offer", models.Offer);
registry.register("models_Checkin", models.Checkin);
// register other models here.
