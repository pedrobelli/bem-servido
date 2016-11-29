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

  var validateCPFFormat = function(cpf) {
    var soma = 0;
    var resto;

    if (cpf == "00000000000") return false;

    for (i=1; i<=9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
	   resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(cpf.substring(9, 10)) ) return false;

    soma = 0;
    for (i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(cpf.substring(10, 11) ) ) return false;

    return true;
  }

  var validateCNPJFormat = function(cnpj) {
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;

    return true;
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
    validateEmailFormat:validateEmailFormat,
    validateCPFFormat:validateCPFFormat,
    validateCNPJFormat:validateCNPJFormat
  }

});
