define(['ko', 'text!qualificacoesClienteTemplate', 'bridge', 'momentComponent', 'qualificacaoModalComponent'],
function(ko, template, bridge, momentComponent, qualificacaoModalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.agendamentos = ko.observableArray([]);
    self.ramos = ko.observableArray([]);
    self.hasResult = ko.observable(false);

    self.qualificar = function(agendamento) {
      var dto = {
        profissional : agendamento.profissionalId,
        agendamento  : agendamento.id,
        cliente      : localStorage.getItem('current_user_id')
      }
      qualificacaoModalComponent.showQualificacaoModal(dto, function() {
        findAgendamentos();
      });
    };

    var mapResponseToAgendamentos = function(agendamentos){
      if(!agendamentos.length) {
        self.hasResult(true);
        return self.agendamentos([])
      };

      self.hasResult(false);
      var agendamentos = agendamentos.map(function(agendamento){
        var profissional = agendamento.profissionai;
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });

        return {
          id             : agendamento.id,
          data           : momentComponent.convertDateToString(momentComponent.convertDateStringToDate(agendamento.dataInicio)),
          profissionalId : profissional.id,
          profissional   : profissional.nome,
          ramo           : ramo.text
        }
      });

      self.agendamentos(agendamentos);
    };

    var findAgendamentos = function() {
      bridge.get("/api/agendamentos/not_qualified_by_clientes/" + localStorage.getItem('current_user_id'))
      .then(function(response){
        mapResponseToAgendamentos(response.agendamentos);
      });
    };

    var init = function(){

      bridge.get("/api/agendamentos/form_options")
      .then(function(response){
        var ramos = response.ramos.map(function(ramo){
          return {
            id   : ramo.id,
            text : ramo.text
          }
        });

        self.ramos(ramos);
      })
      .then(function() {
        findAgendamentos();
      });
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Qualificações do Cliente"
    }
  };
});
