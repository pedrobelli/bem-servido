define(['jquery', 'jqueryInputmask'], function($, jqueryMask) {

  var applyDatepickerMask = function(){
    $(".datepicker").inputmask("dd/mm/yyyy");
  };

  var applyTimeMask = function(){
    $(".time").inputmask("hh:mm");
  };

  var applyZipCodeMask = function(){
    $('.zip-code').inputmask('99999-999');
  };

  var applyNumberMask = function(){
    $('.number').inputmask({alias: 'numeric', rightAlign: false});
  };

  var applyFederalIdMask = function(){
    $('.federal-id').inputmask('999.999.999-99');
  };

  var applyCNPJMask = function(){
    $('.cnpj').inputmask('99.999.999/9999-99');
  };

  var applyCelphoneMask = function(){
    $('.cellphones').inputmask({
      mask: ["(99) 9999-9999", "(99) 99999-9999"],
      greedy : false,
      autoUnmask: true,
      numericInput: true,
      reverse: true
    });
  };

  Inputmask.extendAliases({
    "currency": {
      prefix: "R$ ",
      placeHolder: '0,00',
      radixPoint: ",",
      groupSeparator: '.',
      autoUnmask: true,
      unmaskAsNumber : true,
      rightAlign: false
    }
  });

  var applyCurrencyMask = function(){
    $('.currency').inputmask({alias: 'currency'});
  };

  var applyEmailMask = function(){
    $('.email').inputmask({
      mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
      greedy: false,
      onBeforePaste: function (pastedValue, opts) {
        pastedValue = pastedValue.toLowerCase();
        return pastedValue.replace("mailto:", "");
      },
      definitions: {
        '*': {
          validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
          cardinality: 1,
          casing: "lower"
        }
      }
    });
  };

  var accountingFormat = function(value) {
    var formatedValue = value.toFixed(2).replace(".",",")

    return formatedValue;
  }

  return {
    applyDatepickerMask:applyDatepickerMask,
    applyTimeMask:applyTimeMask,
    applyZipCodeMask:applyZipCodeMask,
    applyFederalIdMask:applyFederalIdMask,
    applyCNPJMask:applyCNPJMask,
    applyCelphoneMask:applyCelphoneMask,
    applyEmailMask:applyEmailMask,
    applyCurrencyMask:applyCurrencyMask,
    applyNumberMask:applyNumberMask,
    accountingFormat:accountingFormat
  }
  
});
