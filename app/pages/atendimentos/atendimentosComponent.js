define(['ko', 'text!./atendimentosTemplate.html', 'bridge', '../shared/moment/momentComponent'],
function(ko, template, bridge, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    self.atendimentos = ko.observableArray([]);

    self.exclude = function(atendimentos) {
      bridge.del("/api/atendimentos" + atendimentos.id).then(function(response) {
        init();
      });
    };

    var mapResponseToEspecialidades = function(atendimentos) {
      if(!atendimentos) return self.atendimento([]);
      var atendimentos = atendimentos.map(function(atendimento) {
        return {
          id      : atendimento.id,
          cliente : atendimento.clienteId,
          data    : momentComponent.convertDateToString(atendimento.dataInicio),
          inicio  : momentComponent.convertTimeToString(atendimento.dataInicio),
          fim     : momentComponent.convertTimeToString(atendimento.dataFim)
        };
      });
      self.atendimentos(atendimentos);
    };

    var init = function() {
      bridge.get("/api/atendimentos").then(function(response) {
        mapResponseToEspecialidades(response.atendimentos);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Atendimentos"
    }
  };
});
