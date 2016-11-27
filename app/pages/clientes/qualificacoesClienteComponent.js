define(['ko', 'text!qualificacoesClienteTemplate', 'bridge', 'momentComponent'],
function(ko, template, bridge, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    self.atendimentos = ko.observableArray([]);
    self.ramos = ko.observableArray([]);

    self.qualificar = function(atendimento) {
      var dto = {
        profissional  : atendimento.profissionalId,
        atendimentoId : atendimento.id,
        cliente      : localStorage.getItem('current_user_id')
      }
      qualificacaoModalComponent.showQualificacaoModal(dto);
    };

    var mapResponseToAtendimentos = function(atendimentos){
      if(!atendimentos.length) return self.atendimentos([]);

      var atendimentos = atendimentos.map(function(atendimento){
        var profissional = atendimento.profissionai;
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });

        return {
          id             : atendimento.id,
          data           : momentComponent.convertDateToString(momentComponent.convertDateStringToDate(atendimento.dataInicio)),
          profissionalId : profissional.id,
          profissional   : profissional.nome,
          ramo           : ramo.text
        }
      });

      self.atendimentos(atendimentos);
    };

    var init = function(){

      bridge.get("/api/atendimentos/form_options")
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
        return bridge.get("/api/atendimentos/not_qualified_by_clientes/" + localStorage.getItem('current_user_id'))
        .then(function(response){
          mapResponseToAtendimentos(response.atendimentos);
        });
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
