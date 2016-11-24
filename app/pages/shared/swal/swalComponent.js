define(['sweetAlert', 'bridge', 'jquery'], function(sweetAlert, bridge, $) {

  function errorAlertWithTitle(errorTitle, errors) {
    var errorBody = $("<div class='swal-body'></div>").css({textAlign: "left"});

    if (!!errors.errors) {
      errors.errors.forEach(function(error){
        errorBody.append($('<h5 class="swal-content"></h5>').html(" - " + error.message));
      });
    } else {
      errorBody.append($('<h5 class="swal-content"></h5>').html(" - " + errors.message));
    }

    sweetAlert({
      title:"<div class='swal-header'>" + errorTitle + "</div>",
      text: errorBody[0].outerHTML,
      confirmButtonColor: "orange",
      type: "error",
      html: true,
      animation: false
    });
  }

  function simpleErrorAlertWithTitle(errorTitle, errors) {
    var errorBody = $("<div class='swal-body'></div>").css({textAlign: "left"});

    errors.forEach(function(error){
      errorBody.append($('<h5 class="swal-content"></h5>').html(" - " + error));
    });

    sweetAlert({
      title:"<div class='swal-header'>" + errorTitle + "</div>",
      text: errorBody[0].outerHTML,
      confirmButtonColor: "orange",
      type: "error",
      html: true,
      animation: false
    });
  }

  function customWarningAction(title, message, callback) {
    sweetAlert({
      title: title,
      text: message,
      type: "warning",
      html: true,
      showCancelButton: false,
      confirmButtonColor: "orange",
      confirmButtonText: "OK",
      closeOnConfirm: true,
      animation: false
    },
    function(answer) {
      $('body').css('overflow', 'visible');
      callback();
    });
  }

  function removeInstanceWarning(url, errorTitle, callback) {
    sweetAlert({
      title: "Tem certeza?",
      text: "Esta operação não pode ser desfeita!",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "orange",
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
    simpleErrorAlertWithTitle:simpleErrorAlertWithTitle,
    customWarningAction:customWarningAction,
    removeInstanceWarning:removeInstanceWarning
  }
});
