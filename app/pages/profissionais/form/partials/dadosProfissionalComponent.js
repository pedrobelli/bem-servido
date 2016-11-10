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

    self.validForm = function(){
      valid = !!self.nomeCompleto();
      // valid = valid && !!self.email();

      return valid;
    };

    self.show = function() {
      $('#dados-profissional').fadeIn();
    };

    self.hide = function() {
      $('#dados-profissional').fadeOut();
    };

    self.subscribe = function() {
      $('select').material_select();

      datepickerComponent.applyDatepicker();

      maskComponent.applyEmailMask();
      maskComponent.applyFederalIdMask();
      maskComponent.applyCNPJMask();
      maskComponent.applyCelphoneMask();
      maskComponent.applyZipCodeMask();
      maskComponent.applyNumberMask();
    };

    self.cleanFields = function() {
      self.nomeCompleto(undefined);
      self.email(undefined);
      self.dataNascimento(undefined);
      self.sexo(undefined);
      self.cpf(undefined);
      self.cnpj(undefined);
      // telefones
      self.telefone(undefined);
      self.celular(undefined);
      // endereco
      self.endereco_rua(undefined);
      self.endereco_num(undefined);
      self.endereco_comp(undefined);
      self.endereco_bairro(undefined);
      self.endereco_cep(undefined);
      self.endereco_cidade(undefined);
      self.endereco_estado(undefined);
      self.sexos([]);
      self.estados([]);
    };

    self.mapResponse = function(response) {
      var sexos = response.sexos.map(function(sexo){
        return {
          id   : sexo.id,
          text : sexo.text
        }
      });

      self.sexos(sexos);

      var estados = response.estados.map(function(estado){
        return {
          id   : estado.id,
          text : estado.text
        }
      });

      self.estados(estados);
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
