define(['ko', 'text!./atendimentosTemplate.html', 'bridge'],
function(ko, template, bridge) {

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
          id: atendimento.id,
          data: atendimento.data,
          duracao: atendimento.duracao
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
