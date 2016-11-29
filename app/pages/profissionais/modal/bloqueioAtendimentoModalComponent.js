define(['ko', 'text!bloqueioAtendimentoModalTemplate', 'jquery', 'bridge', 'maskComponentForm', 'datepickerComponent', 'momentComponent', 'swalComponentForm'],
function(ko, template, $, bridge, maskComponent, datepickerComponent, momentComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.onSuccessCallback = ko.observable(function(){});
    self.profissional = ko.observable();
    self.data = ko.observable();
    self.horaInicio = ko.observable();
    self.horaFim = ko.observable();

    self.salvar  = function() {
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post("/api/atendimentos/new", generatePayload())
      .fail(function(context, errorMessage, serverError) {
        swalComponent.errorAlertWithTitle("Não foi possível realizar o bloqueio", context.errors);
      }).done(function() {
        $('#modal-bloqueio-agendamento').closeModal();
        self.onSuccessCallback();
      });
    };

    self.showBloqueioModal = function(profissionalId, callback){
      cleanFields();

      $('#modal-bloqueio-agendamento').openModal();

      self.profissional(profissionalId);

      self.onSuccessCallback = callback;
    };

    self.subscribe = function(servicos){
      datepickerComponent.applyDatepickerForFuture();
      maskComponent.applyTimeMask();
    };

    var generatePayload = function(){
      var dataInicio = momentComponent.convertStringToDateTime(self.data(), self.horaInicio());
      var dataFim = momentComponent.convertStringToDateTime(self.data(), self.horaFim());

      var timeDiff = Math.abs(dataFim - dataInicio);
      var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
      
      var payload = {
        dataInicio     : dataInicio,
        dataFim        : dataFim,
        duracao        : diffMinutes,
        profissionalId : self.profissional(),
        qualificado    : false,
        bloqueio       : true
      };

      return payload;
    };

    var validate = function() {
      var errors = []
      var valid = !!self.data();
      valid = valid && !!self.horaInicio();
      valid = valid && !!self.horaFim();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para concluir seu agendamento.")
      }

      var reg = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9])$/;
      if (!!self.horaInicio() && !reg.test(self.horaInicio())) {
        errors.push("É necessário preencher um horário valido no campos de horario inicial")
      }

      var reg = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9])$/;
      if (!!self.horaFim() && !reg.test(self.horaFim())) {
        errors.push("É necessário preencher um horário valido no campos de horario final")
      }

      return errors;
    };

    var cleanFields = function() {
      self.data(undefined);
      self.horaInicio(undefined);
      self.horaFim(undefined);
    };

  }

  var instance = new viewModel();

  ko.components.register('bloqueio-atendimento-modal-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
