define(['ko', 'text!detalheAgendamentoModalTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm',
'momentComponent'],
function(ko, template, $, bridge, maskComponent, swalComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    self.onSuccessCallback = ko.observable(function(){});
    self.id = ko.observable();
    self.servico = ko.observable();
    self.dataDiaSemana = ko.observable();
    self.cliente = ko.observable();
    self.telefone = ko.observable();
    self.celular = ko.observable();
    self.horario = ko.observable();
    self.duracao = ko.observable();
    self.valor = ko.observable();
    self.notQualified = ko.observable();

    self.ramos = ko.observableArray([]);
    self.diasSemana = ko.observableArray([]);
    self.estados = ko.observableArray([]);

    self.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    self.cancelar  = function() {
      var errorTitle = 'Não foi possível cancelar agendamento';
      swalComponent.removeInstanceWarning("/api/agendamentos/" + self.id(), errorTitle, function(){
        $('#modal-detalhe-agendamento').closeModal();
        self.onSuccessCallback();
      });
    };

    self.showDetalhesAgendamentoModal = function(agendamentoId, callback){
      cleanFields();

      $('#modal-detalhe-agendamento').openModal();

      bridge.get("/api/agendamentos/get/" + agendamentoId)
      .then(function(response){
        mapResponseToAgendamento(response.agendamento);
      });

      self.onSuccessCallback = callback;
    };

    self.subscribe = function(){
      maskComponent.applyCelphoneMask();
      bridge.get("/api/agendamentos/form_options")
      .then(function(response){
        var ramos = response.ramos.map(function(ramo){
          return {
            id   : ramo.id,
            text : ramo.text
          }
        });

        self.ramos(ramos);

        var diasSemana = response.diasSemana.map(function(diaSemana){
          return {
            id   : diaSemana.id,
            text : diaSemana.text
          }
        });

        self.diasSemana(diasSemana);

        var estados = response.estados.map(function(estado){
          return {
            id    : estado.id,
            text  : estado.text,
            sigla : estado.sigla
          }
        });

        self.estados(estados);
      })
    };

    var mapResponseToAgendamento = function(agendamento){
      if (!agendamento) return cleanFields();

      var data = momentComponent.convertDateStringToDate(agendamento.dataInicio);
      var cliente = agendamento.cliente;
      var telefone = !!cliente ? cliente.telefone.telefone : agendamento.telefone;
      var celular = !!cliente ? cliente.telefone.celular : '';
      var diaSemanaId = momentComponent.returnDateWeekday(data);
      var diaSemana = _.find(self.diasSemana(), function(currentDiaSemana){ return currentDiaSemana.id == diaSemanaId; });

      self.id(agendamento.id);
      self.dataDiaSemana(diaSemana.text + ", " + data.getDate() + " de " + self.meses[data.getMonth()]);
      self.cliente(!!cliente ? cliente.nome : agendamento.nomeCliente);
      self.telefone(!!telefone ? telefone : "");
      self.celular(!!celular ? celular : "");
      self.servico(agendamento.detalhe_servico.servico.nome);
      self.horario(momentComponent.convertTimeToString(agendamento.dataInicio) + " - " + momentComponent.convertTimeToString(agendamento.dataFim));
      self.duracao(agendamento.duracao);
      self.valor(maskComponent.accountingFormat(parseInt(agendamento.valorTotal)));
      self.notQualified(!agendamento.qualificado);
    };

    var cleanFields = function() {
      self.servico(undefined);
      self.dataDiaSemana(undefined);
      self.cliente(undefined);
      self.telefone(undefined);
      self.celular(undefined);
      self.horario(undefined);
      self.duracao(undefined);
      self.valor(undefined);
    };

  }

  var instance = new viewModel();

  ko.components.register('detalhe-agendamento-modal-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
