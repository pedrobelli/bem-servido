define(['jquery', 'jqueryInputmask'], function($, jqueryMask) {

  var applyDatepickerMask = function(){
    $(".datepicker").inputmask("dd/mm/yyyy");
  };

  var applyTimeMask = function(){
    $(".time").inputmask("hh:mm");
  };

  var applyZipCodeMask = function(){
    $('.zip-code').inputmask({mask: '99999-999', autoUnmask: true});
  };

  var applyNumberMask = function(){
    $('.number').inputmask({alias: 'numeric', rightAlign: false});
  };

  var applyCPF_CNPJMask = function(){
    $('.cpf-cnpj').inputmask({mask: ['999.999.999-99', '99.999.999/9999-99'], autoUnmask: true});
  };

  var applyCPFMask = function(){
    $('.cpf').inputmask({mask: '999.999.999-99', autoUnmask: true});
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
      // placeHolder: '0,00',
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

  var scoreFormat = function(value) {
    var formatedValue = value.toFixed(1).replace(".",",")

    return formatedValue;
  }

  var addressFormat = function(endereco, estado) {
    var enderecoString = endereco.rua + ", " + endereco.num ;
    if (!!endereco.complemento) enderecoString = enderecoString + ", " + endereco.complemento;
    enderecoString = enderecoString + " - " + endereco.bairro + ", " + endereco.cidade + " - " + estado.sigla;

    return enderecoString;
  }

  var validateEmailFormat = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  return {
    applyDatepickerMask:applyDatepickerMask,
    applyTimeMask:applyTimeMask,
    applyZipCodeMask:applyZipCodeMask,
    applyCPF_CNPJMask:applyCPF_CNPJMask,
    applyCPFMask:applyCPFMask,
    applyCelphoneMask:applyCelphoneMask,
    applyEmailMask:applyEmailMask,
    applyCurrencyMask:applyCurrencyMask,
    applyNumberMask:applyNumberMask,
    accountingFormat:accountingFormat,
    scoreFormat:scoreFormat,
    addressFormat:addressFormat,
    validateEmailFormat:validateEmailFormat
  }

});
