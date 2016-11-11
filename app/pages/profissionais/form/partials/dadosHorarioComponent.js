define(['ko', 'text!dadosHorarioTemplate', 'jquery', 'underscore', 'maskComponentForm', 'momentComponent'],
function(ko, template, $, _, maskComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    self.horasTrabalho = ko.observableArray([]);
    self.horasTrabalhoSelecionados = [];

    self.validate = function() {
      var errors = []
      valid = self.horasTrabalhoSelecionados.length > 0;
      if (!valid) {
        errors.push("É necessário selecionar pelo menos um dia para montar sua agenda de trabalho.")
      }

      self.horasTrabalho().forEach(function(horaTrabalho){
        if (horaTrabalho.checked()) {
          var horarioInicio = momentComponent.convertStringToMomentTime(horaTrabalho.horarioInicio());
          var horarioFim = momentComponent.convertStringToMomentTime(horaTrabalho.horarioFim());

          if (!horaTrabalho.horarioInicio() || !horaTrabalho.horarioFim()) {
            errors.push("É necessário preencher os campos de horario inicial e final dos dias selecionados")
          }

          if (!horarioInicio.isBefore(horarioFim)) {
            errors.push("O horario final de trabalho não pode ser anterior ao inicial")
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
      self.horasTrabalho([]);
      self.horasTrabalhoSelecionados = [];
    };

    self.mapResponse = function(response) {
      var horasTrabalho = response.horasTrabalho.map(function(horaTrabalho){
        return {
          id            : horaTrabalho.id,
          text          : horaTrabalho.text,
          horarioInicio : ko.observable(undefined),
          horarioFim    : ko.observable(undefined),
          checked       : ko.observable(false)
        }
      });

      self.horasTrabalho(horasTrabalho);
    };

    self.check = function(horario){
      if (horario.checked()) {
        horario.checked(false);
        horario.horarioInicio(undefined);
        horario.horarioFim(undefined);
        $('#horario' + horario.id).removeClass('material-checkbox');

        self.horasTrabalhoSelecionados = _.without(self.horasTrabalhoSelecionados, horario.id);
      } else {
        horario.checked(true);
        $('#horario' + horario.id).addClass('material-checkbox');

        self.horasTrabalhoSelecionados.push(horario.id);
      }
    };

    self.generatePayload = function(payload){
      var horasTrabalho = [];
      self.horasTrabalho().forEach(function(horaTrabalho){
        if (horaTrabalho.checked()) {
          horasTrabalho.push({
            diaSemana  : horaTrabalho.id,
            horaInicio : momentComponent.convertStringToTime(horaTrabalho.horarioInicio()),
            horaFim    : momentComponent.convertStringToTime(horaTrabalho.horarioFim())
          });
        }
      });
      payload.horasTrabalho = JSON.stringify(horasTrabalho);

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