define(['jquery', 'jquery-ui/ui/datepicker', 'jquery-ui/ui/i18n/datepicker-pt-BR'], function($, datepicker, _) {

  var applyDatepicker = function(){
    $( ".datepicker" ).datepicker({
      showAnim: "slideDown",
      showOtherMonths: true,
    });
  };

  return {
    applyDatepicker:applyDatepicker
  };

});
