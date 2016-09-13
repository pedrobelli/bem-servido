define(['ko', 'text!./atendimentosTemplate.html', 'bridge', '../shared/moment/momentComponent', '../shared/swal/swalComponent'],
function(ko, template, bridge, momentComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.atendimentos = ko.observableArray([]);

    self.exclude = function(atendimento) {
      var errorTitle = 'Não foi possível excluir atendimento';
      swalComponent.removeInstanceWarning("/api/atendimentos/" + atendimento.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToEspecialidades = function(atendimentos) {
      if(!atendimentos) return self.atendimento([]);
      var atendimentos = atendimentos.map(function(atendimento) {
        return {
          id        : atendimento.id,
          cliente   : atendimento.cliente.nome,
          prestador : atendimento.profissional.nome,
          data      : momentComponent.convertDateToString(atendimento.dataInicio),
          inicio    : momentComponent.convertTimeToString(atendimento.dataInicio),
          fim       : momentComponent.convertTimeToString(atendimento.dataFim)
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
