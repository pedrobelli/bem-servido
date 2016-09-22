define(['jquery', 'jqueryUi/ui/datepicker', 'jqueryUi/ui/i18n/datepicker-pt-BR'], function($, datepicker, _) {

  var applyDatepicker = function(){
    $( ".datepicker" ).datepicker({
      showAnim: "slideDown",
      showOtherMonths: true,
    });
  };

  return {
    applyDatepicker:applyDatepicker
  }
});
