define(['ko', 'text!especialidadesTemplate', 'bridge', 'jquery', 'swalComponent'],
function(ko, template, bridge, $, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.especialidades = ko.observableArray([]);

    self.exclude = function(especialidades) {
      var errorTitle = 'Não foi possível excluir especialidade';
      swalComponent.removeInstanceWarning("/api/especialidades/" + especialidades.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToEspecialidades = function(especialidades) {
      if(!especialidades) return self.especialidades([]);
      var especialidades = especialidades.map(function(especialidade) {
        return {
          id : especialidade.id,
          nome : especialidade.nome,
          descricao : especialidade.descricao
        };
      });

      self.especialidades(especialidades);
    };

    var init = function() {
      bridge.get("/api/especialidades").then(function(response) {
        mapResponseToEspecialidades(response.especialidades);
      });
    };

    init();
  };

  return {
    viewModel:viewModel,
    template: template,
    title: function(params) {
      return "Especialidades"
    }
  };
});
