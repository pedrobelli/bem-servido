define(['ko', 'text!dadosServicoTemplate', 'jquery', 'maskComponentForm'],
function(ko, template, $, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.ramo = ko.observable();

    self.ramos = ko.observableArray([]);
    self.habilidades = ko.observableArray([])
    self.habilidadesSelecionadas = ko.observableArray([])
    self.servicosSelecionadas = ko.observableArray([])

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.email();

      // return valid;
    });

    self.subscribe = function() {
         $('select').material_select();
         $('.collapsible').collapsible();

         maskComponent.applyNumberMask();
         maskComponent.applyCurrencyMask();
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

  ko.components.register('dados-servico-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
