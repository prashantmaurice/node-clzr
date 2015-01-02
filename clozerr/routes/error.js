
var error = {};

error.ERR_DESCRIPTION = {
	"420":"Insufficient parameters passed",
	"671":"Offer not in the vendor list"
};

error.err( res, code ){
  res.write({ result:false, err:{ code:code, description:ERR_DESCRIPTION[code] || "No description" } })
}

module.exports = error;
