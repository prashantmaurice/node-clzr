
var error = {};

error.ERR_DESCRIPTION = {
	"102":"Wrong parameters for search"
	"420":"Insufficient parameters passed",
	"671":"Offer not in the vendor list",
	"909":"Permission denied",
	"435":"Vendor IDs don't match"
	"619":"User not logged in"//try logining again
	"646":"User not found"//signup again
};

error.err = function( res, code ){
  res.end(JSON.stringify(
    { result:false, err:{ code:code, description: error.ERR_DESCRIPTION[code] || "No description" } }
    ));
}

module.exports = error;
