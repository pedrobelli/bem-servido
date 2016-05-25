define(['sweetAlert', 'bridge', 'jquery'], function(sweetAlert, bridge, $) {

  function errorAlertWithTitle(errorTitle, errors) {
    var errorBody = $("<div class='swal-body'></div>").css({textAlign: "left"});

    if (!!errors.errors) {
      errors.errors.forEach(function(error){
        errorBody.append($('<h5></h5>').html(" - " + error.message));
      });
    } else {
      errorBody.append($('<h5></h5>').html(" - " + errors.message));
    }

    sweetAlert({
      title:"<div class='swal-header'>" + errorTitle + "</div>",
      text: errorBody[0].outerHTML,
      type: "error",
      html: true,
      animation: false
    });
  }

  function removeInstanceWarning(url, errorTitle, callback) {
    sweetAlert({
      title: "Tem certeza?",
      text: "Esta operação não pode ser desfeita!",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim!",
      closeOnConfirm: true,
      animation: false
    },
    function(answer) {
      if (!answer)
        return;

      bridge.del(url)
      .fail(function(context, errorMessage, serverError) {
        setTimeout(function(){
          errorAlertWithTitle(errorTitle, context.errors);
        }, 500)
      })
      .done(function() {
        callback();
      });
    });
  }

  return {
    errorAlertWithTitle:errorAlertWithTitle,
    removeInstanceWarning:removeInstanceWarning
  }

});
