define(['ko', 'text!atendimentoModalTemplate', 'jquery', 'maskComponentForm', 'datepickerComponent', 'momentComponent'],
function(ko, template, $, maskComponent, datepickerComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    self.onSuccessCallback = ko.observable(function(){});
    self.profissional = ko.observable();
    self.cliente = ko.observable();
    self.data = ko.observable();
    self.servico = ko.observable();
    self.horaInicio = ko.observable();
    self.horaFim = ko.observable("00:00");
    self.valor = ko.observable(maskComponent.accountingFormat(0));
    self.duracao = ko.observable(0);

    self.servicos = ko.observableArray([]);

    self.loadValorEDuracao = ko.computed(function(){
      if (!!self.servico()) {
        loadValorEDuracao();
      }
    });

    self.loadHoraFim = ko.computed(function(){
      var reg = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9])$/;
      if (!!self.data() && reg.test(self.horaInicio()) && !!self.duracao()) {
        self.horaFim(momentComponent.calculateHoraFim(self.data(), self.horaInicio(), self.duracao()));
      } else {
        self.horaFim("00:00");
      }
    });

    self.save = function() {
      var
      // var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;
      //
      // bridge.post(path, generatePayload())
      // .fail(function(context, errorMessage, serverError) {
      //   var errorTitle = params.name == 'new' ? 'Não foi possível criar atendimento' : 'Não foi possível alterar atendimento';
      //   swalComponent.errorAlertWithTitle(errorTitle, context.errors);
      // }).done(function() {
      //   window.location.hash = "atendimentos"
      // });
    };

    self.showAtendimentosModal = function(dto, callback){
      cleanFields();
      $('select').material_select();

      $('#modal-agendamento').openModal();

      self.profissional(dto.profissional);
      self.cliente(dto.cliente);
      self.data(dto.data);

      self.onSuccessCallback = callback;
    };

    self.subscribe = function(servicos){
      datepickerComponent.applyDatepickerForFuture();
      maskComponent.applyTimeMask();
      self.servicos(servicos);
      $('select').material_select();
    };

    self.generatePayload = function(payload){
      payload.email = self.email();
      payload.password = self.password();

      return payload;
    };

    var validate = function() {
      var errors = []
      valid = !!self.profissional();
      valid = valid && !!self.cliente();
      valid = valid && !!self.data();
      valid = valid && !!self.servico();
      valid = valid && !!self.horaInicio();
      valid = valid && !!self.horaFim();
      valid = valid && !!self.duracao();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com seu cadastro.")
      }

      return errors;
    };

    var cleanFields = function() {
      self.data(undefined);
      self.servico(undefined);
      self.horaInicio(undefined);
      self.horaFim(undefined);
      self.valor(maskComponent.accountingFormat(0));
      self.duracao(0);
    };

    var loadValorEDuracao = function(){
      var servico = self.servicos().find(function (servico) { return servico.id == self.servico(); });

      self.valor(servico.valor);
      self.duracao(servico.duracao);
    };

  }

  var instance = new viewModel();

  ko.components.register('atendimento-modal-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
