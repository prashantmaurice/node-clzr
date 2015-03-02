/*
 * Put test settings here like which vendor to use to test get/near
 * Also put secret keys here required for database communication.
 */

var SETTINGS = {};

SETTINGS.mongo = {
    username:"mongoadmin",
    password:"clozerradmin",
    database:"fin4",
    host:"db.clozerr.com",
}

SETTINGS.admin = {
    username:"clozerradmin"
}

SETTINGS.vendor = {
    username:"mysample",
    public_name:"SampleVendor",
    password:"password"
}

SETTINGS.core = {
    server:"http://localhost:3000"
}

exports.settings = SETTINGS;
