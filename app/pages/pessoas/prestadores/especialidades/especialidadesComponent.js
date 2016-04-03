define(['ko', 'text!./especialidadesTemplate.html', 'bridge']),
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    self.especialidades = ko.observableArray([]);

    self.exclude = function(especialidades) {
      bridge.del("/api/especialidades" + especialidades.id).then(function(response) {
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
      bridge.get("/api/pessoas").then(function(response) {
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
