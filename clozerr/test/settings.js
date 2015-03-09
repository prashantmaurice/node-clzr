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
    username:"clozerradmin",
    access_token:"6e8d0e08bd88040a049f07c0bdcaa4ed"
}

SETTINGS.vendor = {
    username:"mysample",
    public_name:"SampleVendor",
    password:"password",
    fid:"1234",
    image:"testimage",
    vendorid:"54f37ae23009ee8c2fe33667",
    offerid:"54b03cba1752e1f40383705b",
    reqacctok:"8aeba274a9fad4f865e126104f7ed455"
}

SETTINGS.core = {
    server:"http://localhost:3000"
}
SETTINGS.gen={
	nonadminorvendor:"3dabb3a3ff67abb935fd3fe59988dc82",
	vendorid:"54b03cba1752e1f403837097",
	useracctok:"db134037e1da7148ca8b30c355b89990",
    settings:"abcdefgh"
}

SETTINGS.dummy_user = {
    username:"dummy2",
    access_token:"abcdefghijklmnop",
}

SETTINGS.dummy_vendor = {
    name:"DEFAULT002",
    latitude:10,
    longitude:10,
    vendorid:"54f431d14f8ac1b15aa46d9e",
    access_token:"default002abcd",
    fid:10
}

SETTINGS.dummy_checkin = {
    latitude:10,
    longitude:10
}

exports.settings = SETTINGS;
