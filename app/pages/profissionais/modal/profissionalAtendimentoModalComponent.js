define(['ko', 'text!profissionalAtendimentoModalTemplate', 'jquery', 'bridge', 'maskComponentForm', 'datepickerComponent', 'momentComponent', 'swalComponentForm'],
function(ko, template, $, bridge, maskComponent, datepickerComponent, momentComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.onSuccessCallback = ko.observable(function(){});
    self.profissional = ko.observable();
    self.cliente = ko.observable();
    self.data = ko.observable();
    self.telefone = ko.observable();
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

    self.salvar  = function() {
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post("/api/atendimentos/new", generatePayload())
      .fail(function(context, errorMessage, serverError) {
        swalComponent.errorAlertWithTitle("Não foi possível realizar o agendamento", context.errors);
      }).done(function() {
        $('#modal-agendamento-profissional').closeModal();
        self.onSuccessCallback();
      });
    };

    self.showAtendimentosModal = function(dto, callback){
      cleanFields();
      $('select').material_select();

      $('#modal-agendamento-profissional').openModal();

      self.profissional(dto.profissional);
      self.data(dto.data);

      self.onSuccessCallback = callback;
    };

    self.subscribe = function(servicos){
      datepickerComponent.applyDatepickerForFuture();
      maskComponent.applyTimeMask();
      maskComponent.applyCelphoneMask();
      self.servicos(servicos);
      $('select').material_select();
    };

    var generatePayload = function(){
      var payload = {
        valorTotal       : parseInt(self.valor()),
        dataInicio       : momentComponent.convertStringToDateTime(self.data(), self.horaInicio()),
        dataFim          : momentComponent.convertStringToDateTime(self.data(), self.horaFim()),
        duracao          : self.duracao(),
        profissionalId   : self.profissional(),
        nomeCliente      : self.cliente(),
        telefone         : self.telefone(),
        detalheServicoId : self.servico(),
        qualificado      : false
      };

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
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para concluir seu agendamento.")
      }

      var reg = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9])$/;
      if (!!self.horaInicio() && !reg.test(self.horaInicio())) {
        errors.push("É necessário preencher um horário valido no campos de horario inicial")
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

  ko.components.register('profissional-atendimento-modal-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
