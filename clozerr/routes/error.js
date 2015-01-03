
var error = {};

error.ERR_DESCRIPTION = {
	"420":"Insufficient parameters passed",
	"671":"Offer not in the vendor list",
	"909":"Permission denied",
	"435":"Vendor IDs don't match"
};

error.err = function( res, code, desc ){
  res.end(JSON.stringify(
    { result:false, err:{ code:code, description: ( desc || error.ERR_DESCRIPTION[code] || "No description" ) } }
    ));
}

function err_insuff_params(reqq, arr) {
	var errobj = {code,params=[]};
	for(var i=0;i<arr.length;i++) {
		param = arr[i];
		if(!(reqq[param]))
			errobj.params.push(param);
	}
	errobj.code = "420";
	return errobj;
}

module.exports = error;
