define(['ko', 'text!detalheAtendimentoModalTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm',
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
      swalComponent.removeInstanceWarning("/api/atendimentos/" + self.id(), errorTitle, function(){
        $('#modal-detalhe-agendamento').closeModal();
        self.onSuccessCallback();
      });
    };

    self.showDetalhesAtendimentoModal = function(atendimentoId, callback){
      cleanFields();

      $('#modal-detalhe-agendamento').openModal();

      bridge.get("/api/atendimentos/get/" + atendimentoId)
      .then(function(response){
        mapResponseToAtendimento(response.atendimento);
      });

      self.onSuccessCallback = callback;
    };

    self.subscribe = function(){
      maskComponent.applyCelphoneMask();
      bridge.get("/api/atendimentos/form_options")
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

    var mapResponseToAtendimento = function(atendimento){
      if (!atendimento) return cleanFields();

      var data = momentComponent.convertDateStringToDate(atendimento.dataInicio);
      var cliente = atendimento.cliente;
      var telefone = cliente.telefone.telefone;
      var celular = cliente.telefone.celular;
      var diaSemanaId = momentComponent.returnDateWeekday(data);
      var diaSemana = _.find(self.diasSemana(), function(currentDiaSemana){ return currentDiaSemana.id == diaSemanaId; });

      self.id(atendimento.id);
      self.dataDiaSemana(diaSemana.text + ", " + data.getDate() + " de " + self.meses[data.getMonth()]);
      self.cliente(cliente.nome);
      self.telefone(!!telefone ? telefone : "");
      self.celular(!!celular ? celular : "");
      self.servico(atendimento.detalhe_servico.servico.nome);
      self.horario(momentComponent.convertTimeToString(atendimento.dataInicio) + " - " + momentComponent.convertTimeToString(atendimento.dataFim));
      self.duracao(atendimento.duracao);
      self.valor(maskComponent.accountingFormat(parseInt(atendimento.valorTotal)));
      self.notQualified(!atendimento.qualificado);
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

  ko.components.register('detalhe-atendimento-modal-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
