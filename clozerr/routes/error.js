
var error = {};

error.ERR_DESCRIPTION = {
	"420":"Insufficient parameters passed",
	"671":"Offer not in the vendor list",
	"909":"Permission denied",
	"435":"Vendor IDs don't match"
};

error.err = function( res, code ){
  res.end(JSON.stringify(
    { result:false, err:{ code:code, description: error.ERR_DESCRIPTION[code] || "No description" } }
    ));
}

module.exports = error;
