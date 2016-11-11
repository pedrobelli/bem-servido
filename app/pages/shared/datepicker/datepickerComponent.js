define(['jquery'], function($) {

  var applyDatepicker = function(){
    $('.datepicker').pickadate({
      monthsFull: [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
      monthsShort: [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
      weekdaysFull: [ 'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado' ],
      weekdaysShort: [ 'dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab' ],
      today: 'hoje',
      clear: 'limpar',
      close: 'fechar',
      format: 'dd/mm/yyyy',
      selectMonth: true,
      selectYears: 140
    });
  };

  return {
    applyDatepicker:applyDatepicker
  }
});
