define(['ko', 'text!dadosHorarioTemplate', 'jquery', 'underscore', 'maskComponentForm'],
function(ko, template, $, _, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.diasSemana = ko.observableArray([]);
    self.diasSemanaSelecionados = [];

    self.validate = function() {
      var errors = []
      valid = self.diasSemanaSelecionados.length > 0;
      if (!valid) {
        errors.push("É necessário selecionar pelo menos um dia para montar sua agenda de trabalho.")
      }

      self.diasSemana().forEach(function(diaSemana){
        if (diaSemana.checked()) {
          if (!diaSemana.horarioInicio() || !diaSemana.horarioFim()) {
            errors.push("É necessário preencher os campos de horario inicial e final dos dias selecionados")
          }
        }
      });

      return errors;
    };

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
      self.diasSemana([]);
      self.diasSemanaSelecionados = [];
    };

    self.mapResponse = function(response) {
      var diasSemana = response.diasSemana.map(function(diaSemana){
        return {
          id            : diaSemana.id,
          text          : diaSemana.text,
          horarioInicio : ko.observable(undefined),
          horarioFim    : ko.observable(undefined),
          checked       : ko.observable(false)
        }
      });

      self.diasSemana(diasSemana);
    };

    self.check = function(horario){
      if (horario.checked()) {
        horario.checked(false);
        horario.horarioInicio(undefined);
        horario.horarioFim(undefined);
        $('#horario' + horario.id).removeClass('material-checkbox');

        self.diasSemanaSelecionados = _.without(self.diasSemanaSelecionados, horario.id);
      } else {
        horario.checked(true);
        $('#horario' + horario.id).addClass('material-checkbox');

        self.diasSemanaSelecionados.push(horario.id);
      }
    };

    self.generatePayload = function(payload){
      var diasSemana = [];
      self.diasSemana().forEach(function(diaSemana){
        if (diaSemana.checked()) {
          diasSemana.push({
            id            : diaSemana.id,
            horarioInicio : diaSemana.horarioInicio(),
            horarioFim    : diaSemana.horarioFim()
          });
        }
      });
      payload.diasSemana = JSON.stringify(diasSemana);

      return payload;
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
