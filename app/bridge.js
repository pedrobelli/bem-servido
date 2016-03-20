define(['jquery'], function ($) {

  var executeRequest = function(url, method, data){
    var result = $.Deferred();

    var request = {};
    request.url = url;
    request.type = method;

    if(data) request.data = data;

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
    get : function (url) {
      return executeRequest(url, "GET");
    },
    post : function (url, data) {
      return executeRequest(url, "POST", data);
    },
    del : function (url) {
      return executeRequest(url, "DELETE");
    }
  }
});
