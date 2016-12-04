define(['ko', 'text!agendaClienteTemplate', 'jquery', 'underscore', 'bridge', 'datepickerComponent', 'momentComponent',
'maskComponent', 'swalComponent'],
function(ko, template, $, _, bridge, datepickerComponent, momentComponent, maskComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.servico = ko.observable();
    self.data = ko.observable(params.data != 'undefined' ? params.data : momentComponent.convertDateToString(new Date()));
    self.hasResult = ko.observable(false);

    self.ramos = ko.observableArray([]);
    self.diasSemana = ko.observableArray([]);
    self.estados = ko.observableArray([]);
    self.agendamentos = ko.observableArray([]);

    self.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    self.pesquisa = function(){
      findAgendamentos();
    };

    self.cancelar = function(agendamento){
      var errorTitle = 'Não foi possível cancelar agendamento';
      swalComponent.removeInstanceWarning("/api/agendamentos/" + agendamento.id, errorTitle, function(){
        findAgendamentos();
      });
    };

    var generatePayload = function(){
      var payload = {
        servico : self.servico(),
        data    : returnData(),
        cliente : localStorage.getItem('current_user_id')
      };

      return payload;
    };

    var mapResponseToAgendamentos = function(agendamentos){
      if(!agendamentos.length) {
        self.hasResult(true);
        return self.agendamentos([]);
      }

      self.hasResult(false);
      var agendamentos = agendamentos.map(function(agendamento){
        var data = momentComponent.convertDateStringToDate(agendamento.dataInicio);
        var profissional = agendamento.profissionai;
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });
        var estado = _.find(self.estados(), function(estado){ return estado.id == profissional.endereco.estado; });
        var telefone = profissional.telefone.telefone;
        var celular = profissional.telefone.celular;
        var diaSemanaId = momentComponent.returnDateWeekday(returnData());
        var diaSemana = _.find(self.diasSemana(), function(currentDiaSemana){ return currentDiaSemana.id == diaSemanaId; });

        return {
          id            : agendamento.id,
          dataDiaSemana : diaSemana.text + ", " + data.getDate() + " de " + self.meses[data.getMonth()],
          profissional  : profissional.nome,
          ramo          : ramo.text,
          endereco      : maskComponent.addressFormat(profissional.endereco, estado),
          telefone      : !!telefone ? telefone : "",
          celular       : !!celular ? celular : "",
          servico       : agendamento.detalhe_servico.servico.nome,
          horario       : momentComponent.convertTimeToString(agendamento.dataInicio) + " - " + momentComponent.convertTimeToString(agendamento.dataFim),
          duracao       : agendamento.duracao,
          valor         : maskComponent.accountingFormat(parseInt(agendamento.valorTotal)),
          notQualified  : !agendamento.qualificado
        }
      });

      self.agendamentos(agendamentos);
    };

    var findAgendamentos = function() {
      return bridge.post("/api/agendamentos/by_clientes", generatePayload())
      .then(function(response){
        mapResponseToAgendamentos(response.agendamentos);
      });
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

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
      .then(function() {
        return findAgendamentos();
      })
      .then(function() {
        maskComponent.applyCelphoneMask();
        $('.collapsible').collapsible();
      });
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Agenda do cliente"
    }
  };
});
