var request = require('request');
var deferred = require('../../common-utils/deferred');

function HttpClient() {}

HttpClient.prototype.main = function() {
    //TODO: add response status code in result to callback like how #mainRaw function does
    var args = Array.prototype.slice.call(arguments, 0);
	return deferred.defer(function (callbacks) {
        function callback(err, resObject, result) {
            if (err || resObject.statusCode > 400) {
                callbacks.failure(err);
            } else {
                callbacks.success(result);
            }
        }
        args.push(callback);
        request.apply(null, args);
    });
};
HttpClient.prototype.mainRaw = function() {//this does not call failure in case of status 400
    var args = Array.prototype.slice.call(arguments, 0);
    return deferred.defer(function (callbacks) {
        function callback(err, resObject, result) {
            if (err || resObject.statusCode >= 500) {
                console.log("FAIL");
                callbacks.failure(err);
            } else {
                var returnData = {
                    statusCode  :   resObject.statusCode,
                    result      :   result
                };
                callbacks.success(returnData);
            }
        }
        args.push(callback);
        request.apply(null, args);
    });
};

HttpClient.prototype.getJSON = function(url,headers) {
    var options = {
        url : url,
        method : 'GET',
        headers : {
          "Content-type" : "application/json"
        }
    };
    if(headers) options.headers = headers;
  return this.mainRaw(options);
};
HttpClient.prototype.getXML = function(url, headers) {
    var options = {
        url : url,
        method : 'GET',
        headers : {
            "Content-type" : "application/json"
        }
    };
    if(headers) options.headers = headers;
    return this.mainRaw(options);
};
HttpClient.prototype.postXMLRaw = function(url, headers, params) {
    var options = {
        url : url,
        method : 'POST',
        headers : {
            "Content-type" : "application/xml"
        },
        body : params
    };
    if(headers) options.headers = headers;
    return this.mainRaw(options);
};
HttpClient.prototype.putXMLRaw = function(url, headers, params) {
    var options = {
        url : url,
        method : 'PUT',
        headers : {
            "Content-type" : "application/xml"
        },
        body : params
    };
    if(headers) options.headers = headers;
    return this.mainRaw(options);
};

HttpClient.prototype.postJSONRaw = function(url, headers, params) {
    var options = {
        url : url,
        method : "POST",
        json : params
    };
    if(headers) options.headers = headers;
    return this.mainRaw(options);
};
HttpClient.prototype.putJSONRaw = function(url, headers, params) {
    var options = {
        url : url,
        method : "PUT",
        json : params
    };
    if(headers) options.headers = headers;
    return this.mainRaw(options);
};
HttpClient.prototype.deleteJSONRaw = function(url, headers, params) {
    var options = {
        url : url,
        method : "DELETE",
        json : params
    };
    if(headers) options.headers = headers;
    return this.mainRaw(options);
};

exports.HttpClient = HttpClient;
exports.getInstance = function() {
	return new HttpClient(); 
};
