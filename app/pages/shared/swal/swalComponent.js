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

  function customWarningAction(warnings, callback) {
    var warningBody = $("<div class='swal-body'></div>").css({textAlign: "left"});

    warnings.forEach(function(warning){
      warningBody.append($('<h5 class="swal-content"></h5>').html(" - " + warning));
    });

    sweetAlert({
      title:"<div class='swal-header'>Esta operação não pode ser desfeita!</div>",
      text: warningBody[0].outerHTML,
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

  function customWarningActionWithTitle(title, message, callback) {
    var warningBody = $("<div class='swal-body'></div>");
    warningBody.append($('<h5 class="swal-content"></h5>').html(message));

    sweetAlert({
      title:"<div class='swal-header'>" + title + "</div>",
      text: warningBody[0].outerHTML,
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
    var warningBody = $("<div class='swal-body'></div>");
    messageBody.append($('<h5 class="swal-content"></h5>').html("Esta operação não pode ser desfeita!"));

    sweetAlert({
      title:"<div class='swal-header'>Tem certeza?</div>",
      text: messageBody[0].outerHTML,
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
    customWarningActionWithTitle:customWarningActionWithTitle,
    removeInstanceWarning:removeInstanceWarning
  }
});
