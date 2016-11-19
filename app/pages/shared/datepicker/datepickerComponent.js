define(['jquery'], function($) {

  var applyDatepicker = function(){
    $('.datepicker').pickadate({
      monthsFull: [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
      monthsShort: [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
      weekdaysFull: [ 'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado' ],
      weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
      today: 'hoje',
      clear: 'limpar',
      close: 'fechar',
      format: 'dd/mm/yyyy',
      selectMonths: true,
      selectYears: 140
    });
  };

  var applyDatepickerForFuture = function(){
    $('.datepicker').pickadate({
      monthsFull: [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
      monthsShort: [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
      weekdaysFull: [ 'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado' ],
      weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
      today: 'hoje',
      clear: 'limpar',
      close: 'fechar',
      format: 'dd/mm/yyyy',
      selectMonths: true,
      selectYears: 140,
      min: new Date()
    });
  };

  return {
    applyDatepicker:applyDatepicker,
    applyDatepickerForFuture:applyDatepickerForFuture
  }
});
