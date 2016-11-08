define(['ko', 'text!dadosHorarioTemplate', 'jquery', 'maskComponentForm'],
function(ko, template, $, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.diasSemana = ko.observableArray([]);

    self.validForm = ko.pureComputed(function(){
      // valid = !!self.nome();
      // valid = valid && !!self.email();

      // return valid;
    });

    self.show = function() {
      $('#dados-horario').fadeIn();
    };

    self.hide = function() {
      $('#dados-horario').fadeOut();
    };

    self.subscribe = function() {
      maskComponent.applyTimeMask();
    };

    self.cleanFields = function() {
      self.diasSemana([])
    };

    self.mapResponse = function(response) {
      var diasSemana = response.diasSemana.map(function(diaSemana){
        return {
          id            : diaSemana.id,
          text          : diaSemana.text,
          horarioInicio : "",
          horarioFim    : ""
        }
      });

      self.diasSemana(diasSemana);
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

  ko.components.register('dados-horario-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
