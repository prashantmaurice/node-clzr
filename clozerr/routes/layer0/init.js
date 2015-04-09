
// Load the registry( for complete service abstraction ) and messaging ( for event-driven classes ).
var loadReg = require("./registry"); 

// Load the router to start accepting requests.
var router = require("./router");

exports.router = router;
// Call require on other files to allow them to register their services.
require("./error");
require("./settings");
require("./models");
//require("./");
var normalizedPath = require("path").join(__dirname, "main");

var requireDirectory = require('require-directory');
var routes = requireDirectory(module, './routes');

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./main/" + file);
});
