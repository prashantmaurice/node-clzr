/**
 * This is a global registry object that is being used to Register Objects which can be used globally
 * throughout the app
 *
 */

var sharedObjects = require('./../../common-utils/sharedObjects');
global.registry2 = sharedObjects;

//Register some Objects
//global.registry2.register( "settings", settings );

