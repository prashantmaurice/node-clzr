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

SETTINGS.dummy_user = {
    username:"dummy2",
    access_token:"abcdefghijklmnop",
}

SETTINGS.dummy_vendor = {
    name:"DEFAULT002",
    latitude:10,
    longitude:10
}

SETTINGS.dummy_checkin = {
    latitude:10,
    longitude:10
}

exports.settings = SETTINGS;
