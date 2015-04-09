
// Load the registry( for complete service abstraction ) and messaging ( for event-driven classes ).
var loadReg = require("./registry"); 

// Load the router to start accepting requests.
var router = require("./router");
var fs = require("fs");

var requireAllFiles = function( normalizedPath ) {
	fs.readdirSync(normalizedPath).forEach(function(child) {

		var normalizedPathChild = normalizedPath + "/" + child;
		if(fs.lstatSync(normalizedPathChild).isDirectory()) {
			requireAllFiles(normalizedPathChild);
			console.log("file required : " + normalizedPathChild);
		}
		else {
			require(normalizedPathChild);
			console.log("file required : " + normalizedPathChild);
		}
	});
}

exports.router = router;
// Call require on other files to allow them to register their services.
require("./error");
require("./settings");
require("./models");
//require("./");
var normalizedPath = require("path").join(__dirname, "main");

var requireDirectory = require('require-directory');
var routes = requireDirectory(module, './');

requireAllFiles(normalizedPath);