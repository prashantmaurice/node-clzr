
var error = {};

error.ERR_DESCRIPTION = {

};

error.err = function( res, code ){
  res.end(JSON.stringify(
    { result:false, err:{ code:code, description: error.ERR_DESCRIPTION[code] || "No description" } }
    ));
}

module.exports = error;
