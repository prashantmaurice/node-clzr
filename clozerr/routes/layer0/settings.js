
// This file is responsible for uploading global settings to
// the registry under the name "settings".

var settings = require("../settings");
global.registry.register( "settings", settings );
