
var error = {};

error.ERR_DESCRIPTION = {
	"102":"Wrong parameters for search",
	"420":"Insufficient parameters passed",
	"671":"Offer not in the vendor list",
	"909":"Permission denied",
	"435":"Vendor IDs don't match",
	"619":"User not logged in",//try logining again
	"646":"User not found"//signup again
};

error.err = function( res, code, desc ){
  res.end(JSON.stringify(
    { result:false, err:{ code:code, description: ( desc || error.ERR_DESCRIPTION[code] || "No description" ) } }
    ));
}

error.err_insuff_params = function(reqq, arr) {
	var errobj = {  params:[] };
	for(var i=0;i<arr.length;i++) {
		param = arr[i];
		if( !(reqq[param]) )
			errobj.params.push(param);
	}
	errobj.code = "420";
	return errobj;
}

module.exports = error;
