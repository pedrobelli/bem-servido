define(['ko', 'text!agendaClienteTemplate', 'jquery', 'underscore', 'bridge', 'datepickerComponent', 'momentComponent', 'maskComponent'],
function(ko, template, $, _, bridge, datepickerComponent, momentComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.servico = ko.observable();
    self.data = ko.observable(momentComponent.convertDateToString(new Date()));

    self.ramos = ko.observableArray([]);
    self.diasSemana = ko.observableArray([]);
    self.estados = ko.observableArray([]);
    self.atendimentos = ko.observableArray([]);

    self.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    self.pesquisa = function(){
      findAtendimentos();
    };

    var generatePayload = function(){
      var payload = {
        servico : self.servico(),
        data    : returnData(),
        cliente : localStorage.getItem('current_user_id')
      };

      return payload;
    };

    var mapResponseToAtendimentos = function(atendimentos){
      if(!atendimentos.length) return self.atendimentos([]);

      var atendimentos = atendimentos.map(function(atendimento){
        var data = momentComponent.convertDateStringToDate(atendimento.dataInicio);
        var profissional = atendimento.profissionai;
        var endereco = profissional.endereco;
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });
        var estado = _.find(self.estados(), function(estado){ return estado.id == profissional.endereco.estado; });
        var telefone = profissional.telefone.telefone;
        var celular = profissional.telefone.celular;
        var diaSemanaId = momentComponent.returnDateWeekday(returnData());
        var diaSemana = _.find(self.diasSemana(), function(currentDiaSemana){ return currentDiaSemana.id == diaSemanaId; });

        var enderecoString = endereco.rua + ", " + endereco.num ;
        if (!!endereco.complemento) enderecoString = enderecoString + ", " + endereco.complemento;
        enderecoString = enderecoString + " - " + endereco.bairro + ", " + endereco.cidade + " - " + estado.sigla;

        return {
          dataDiaSemana : diaSemana.text + ", " + data.getDate() + " de " + self.meses[data.getMonth()],
          profissional  : profissional.nome,
          ramo          : ramo.text,
          endereco      : enderecoString,
          telefone      : !!telefone ? telefone : "",
          celular       : !!celular ? celular : "",
          servico       : atendimento.detalhe_servico.servico.nome,
          horario       : momentComponent.convertTimeToString(atendimento.dataInicio) + " - " + momentComponent.convertTimeToString(atendimento.dataFim),
          duracao       : atendimento.duracao,
          valor         : maskComponent.accountingFormat(parseInt(atendimento.valorTotal))
        }
      });

      self.atendimentos(atendimentos);
    };

    var findAtendimentos = function() {
      return bridge.post("/api/atendimentos/by_clientes", generatePayload())
      .then(function(response){
        mapResponseToAtendimentos(response.atendimentos);
      });
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

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
      .then(function() {
        return findAtendimentos();
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
