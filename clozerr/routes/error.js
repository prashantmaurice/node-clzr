
var error = {};

error.ERR_DESCRIPTION = {

};

error.err = function( res, code ){
  res.write({ result:false, err:{ code:code, description:ERR_DESCRIPTION[code] || "No description" } })
}

module.exports = error;
