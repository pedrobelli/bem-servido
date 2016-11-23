define(['jquery'], function ($) {

  var executeRequest = function(url, method, headers, data){
    var result = $.Deferred();

    var request = {};
    request.url = url;
    request.type = method;

    if(data) request.data = data;
    if(headers) request.headers = headers;

    $.ajax(request).done(function (data, textStatus, jqXHR) {
      result.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR && jqXHR.status) {
        if (jqXHR.status == 403)
          return window.location.hash = "#login";

        if (jqXHR.status == 412)
          return window.location.hash = "#denied";
      }

      result.rejectWith(this, [jqXHR.responseJSON, textStatus, errorThrown, jqXHR]);
    });

    return result.promise();
  };

  return {
    get : function (url, headers) {
      return executeRequest(url, "GET", headers);
    },
    post : function (url, data, headers) {
      if (headers) {
        return executeRequest(url, "POST", headers, data);
      } else {
        return executeRequest(url, "POST", undefined, data);
      }
    },
    patch : function (url, data, headers) {
      if (headers) {
        return executeRequest(url, "PATCH", headers, data);
      } else {
        return executeRequest(url, "PATCH", undefined, data);
      }
    },
    del : function (url, headers) {
      return executeRequest(url, "DELETE", headers);
    }
  }
});
