
// Load the registry( for complete service abstraction ) and messaging ( for event-driven classes ).
var loadReg = require("./registry"); 

// Load the router to start accepting requests.
var router = require("./router");
var fs = require("fs");

var modules = [];

var requireAllFiles = function( normalizedPath , modules, prefix) {
	fs.readdirSync(normalizedPath).forEach(function(child) {

		var normalizedPathChild = normalizedPath + "/" + child;
		if(fs.lstatSync(normalizedPathChild).isDirectory()) {
			var childCapitalised = child.charAt(0).toUpperCase() + child.slice(1);
			modules = requireAllFiles(normalizedPathChild, modules, prefix + childCapitalised);
		}
		else {
			var var_name = child.split(".")[0];
			var_name = prefix.charAt(0).toLowerCase() + prefix.slice(1) + var_name.charAt(0).toUpperCase() + var_name.slice(1);
			modules[var_name] = require(normalizedPathChild);
			console.log("LOADED Module : " + normalizedPathChild);
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

modules = requireAllFiles(normalizedPath, [], "");
console.log(modules);
//console.log(global);