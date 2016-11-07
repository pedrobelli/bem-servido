define(['ko', 'text!dadosProfissionalTemplate', 'jquery', 'maskComponentForm', 'datepickerComponent'],
function(ko, template, $, maskComponent, datepickerComponent) {

  var viewModel = function(params) {
    var self = this;

    self.nomeCompleto = ko.observable();
    self.email = ko.observable();
    self.dataNascimento = ko.observable();
    self.sexo = ko.observable();
    self.cpf = ko.observable();
    self.cnpj = ko.observable();

    // telefones
    self.telefone = ko.observable();
    self.celular = ko.observable();

    // endereco
    self.endereco_rua = ko.observable();
    self.endereco_num   = ko.observable();
    self.endereco_comp = ko.observable();
    self.endereco_bairro = ko.observable();
    self.endereco_cep = ko.observable();
    self.endereco_cidade = ko.observable();
    self.endereco_estado = ko.observable();

    self.sexos = ko.observableArray([]);
    self.estados = ko.observableArray([]);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.email();

      return valid;
    });

    self.subscribe = function() {
         $('select').material_select();

         datepickerComponent.applyDatepicker();

         maskComponent.applyDatepickerMask();
         maskComponent.applyEmailMask();
         maskComponent.applyFederalIdMask();
         maskComponent.applyCNPJMask();
         maskComponent.applyCelphoneMask();
         maskComponent.applyZipCodeMask();
         maskComponent.applyNumberMask();
    };

    var generatePayload = function(){
      // var payload = {
      //   nome           : self.nome(),
      //   email          : self.email(),
      // };
      //
      // return payload;
    };

  }

  var instance = new viewModel();

  ko.components.register('dados-profissional-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
