define(['ko', 'text!./horasTrabalhoFormTemplate.html', 'bridge', 'jquery', 'underscore', 'swalComponentForm', 'maskComponentForm',
'momentComponent'],
function(ko, template, bridge, $, _, swalComponent, maskComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/horas_trabalho/new";
    var UPDATE_PATH = "/api/horas_trabalho/edit";
    var DELETE_PATH = "/api/horas_trabalho/";

    self.errorTitle = "Ocorreu um erro na edição de horários de trabalho!";

    self.horasTrabalho = ko.observableArray([]);

    self.horasTrabalhoSelecionados = [];

    self.save = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post("/api/horas_trabalho/validate_warning", generatePayloadForValidation())
      .then(function(response) {
        var warnings = _.uniq(response.warnings);
        if (warnings.length > 0) {
          warnings.push('Esta ação cancelara todos estes agendamentos, deseja continuar?');
          swalComponent.customWarningAction(warnings, function() {
            saveHorasTrabalho()
          });
        } else {
          saveHorasTrabalho();
        }
      })
      .fail(function(context, errorMessage, serverError){
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
      });
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
        horario.horarioInicio("08:00");
        horario.horarioFim("18:00");
        $('#horario' + horario.id).addClass('material-checkbox');

        self.horasTrabalhoSelecionados.push(horario.id);
      }
    };

    var validate = function(){
      var errors = []
      valid = self.horasTrabalhoSelecionados.length > 0;
      if (!valid) {
        errors.push("É necessário selecionar pelo menos um dia para montar sua agenda de trabalho.");
      }

      self.horasTrabalho().forEach(function(horaTrabalho){
        if (horaTrabalho.checked()) {

          if (!horaTrabalho.horarioInicio() || !horaTrabalho.horarioFim()) {
            errors.push("É necessário preencher os campos de horário inicial e final dos dias selecionados");
          }

          var reg = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9])$/;
          if (!reg.test(horaTrabalho.horarioInicio()) || !reg.test(horaTrabalho.horarioFim())) {
            errors.push("É necessário preencher horários validos nos campos de horario inicial e final");
          } else {
            var horarioInicio = momentComponent.convertTimeStringToMoment(horaTrabalho.horarioInicio());
            var horarioFim = momentComponent.convertTimeStringToMoment(horaTrabalho.horarioFim());
            if (horarioFim.diff(horarioInicio, 'minutes') <= 0) {
              errors.push("O horario final de trabalho não pode ser anterior ou igual ao inicial");
            }
          }
        }
      });

      return errors;
    };

    var generatePayload = function(horaTrabalho){
      var payload = {
        diaSemana      : horaTrabalho.id,
        horaInicio     : momentComponent.convertStringToTime(horaTrabalho.horarioInicio()),
        horaFim        : momentComponent.convertStringToTime(horaTrabalho.horarioFim()),
        profissionalId : localStorage.getItem('current_user_id')
      };

      if(!!horaTrabalho.registerId) payload.id = horaTrabalho.registerId;

      return payload;
    };

    var generatePayloadForValidation = function(){
      var payload = {};
      var horasTrabalho = [];
      self.horasTrabalho().forEach(function(horaTrabalho){
        horasTrabalho.push({
          id         : horaTrabalho.registerId,
          diaSemana  : horaTrabalho.id,
          horaInicio : momentComponent.convertStringToTime(horaTrabalho.horarioInicio()),
          horaFim    : momentComponent.convertStringToTime(horaTrabalho.horarioFim()),
          checked    : horaTrabalho.checked()
        });
      });
      payload.horasTrabalho = JSON.stringify(horasTrabalho);

      return payload;
    };

    var saveHorasTrabalho = function(){
      self.horasTrabalho().forEach(function(horaTrabalho){
        if (horaTrabalho.checked() && !!horaTrabalho.registerId) {
          updateHoraTrabalho(horaTrabalho);
        } else if (horaTrabalho.checked() && !horaTrabalho.registerId) {
          createHoraTrabalho(horaTrabalho);
        } else
        if (!horaTrabalho.checked() && !!horaTrabalho.registerId) {
          deleteHoraTrabalho(horaTrabalho);
        }
      });

      window.location.hash = "#profissionais/agendamentos"
    };

    var updateHoraTrabalho = function(horaTrabalho){
      bridge.post(UPDATE_PATH, generatePayload(horaTrabalho))
      .fail(function(context, errorMessage, serverError){
        console.log(horaTrabalho);
        console.log(self.errorTitle);
        console.log(context.errors);
      });
    };

    var createHoraTrabalho = function(horaTrabalho){
      bridge.post(CREATE_PATH, generatePayload(horaTrabalho))
      .fail(function(context, errorMessage, serverError){
        console.log(horaTrabalho);
        console.log(self.errorTitle);
        console.log(context.errors);
      });
    };

    var deleteHoraTrabalho = function(horaTrabalho){
      bridge.del(DELETE_PATH + horaTrabalho.registerId)
      .fail(function(context, errorMessage, serverError){
        console.log(horaTrabalho);
        console.log(self.errorTitle);
        console.log(context.errors);
      });
    };

    var init = function(){
      var horasTrabalhoProfissional = [];

      bridge.post("/api/horas_trabalho/by_profissional", { profissional : localStorage.getItem('current_user_id') })
      .then(function(response){
        horasTrabalhoProfissional = response.horasTrabalho;
      })
      .then(function() {
        return bridge.get("/api/profissionais/form_options")
        .then(function(response){
          var horasTrabalho = response.horasTrabalho.map(function(horaTrabalho){
            var horaTrabalhoProfissional = _.find(horasTrabalhoProfissional, function(horaTrabalhoProfissional){
               return horaTrabalhoProfissional.profissionalId == parseInt(localStorage.getItem('current_user_id')) &&
               horaTrabalhoProfissional.diaSemana == horaTrabalho.id;
             });
             if (!!horaTrabalhoProfissional) self.horasTrabalhoSelecionados.push(horaTrabalho.id);

             var inicio = !!horaTrabalhoProfissional ? momentComponent.convertTimeToString(horaTrabalhoProfissional.horaInicio) : undefined;
             var fim = !!horaTrabalhoProfissional ? momentComponent.convertTimeToString(horaTrabalhoProfissional.horaFim) : undefined;

            return {
              id            : horaTrabalho.id,
              registerId    : !!horaTrabalhoProfissional ? horaTrabalhoProfissional.id : undefined,
              text          : horaTrabalho.text,
              horarioInicio : ko.observable(inicio),
              horarioFim    : ko.observable(fim),
              checked       : ko.observable(!!horaTrabalhoProfissional ? true : false)
            };
          });

          self.horasTrabalho(horasTrabalho);
        });
      })
      .then(function(){
        maskComponent.applyTimeMask();

        self.horasTrabalho().forEach(function(horaTrabalho){
          if (!!horaTrabalho.registerId) $('#horario' + horaTrabalho.id).addClass('material-checkbox');
        });
      });
    };

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Horas de Trabalho form"
    }
  };
});
