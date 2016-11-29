define(['ko', 'text!especialidadesTemplate', 'bridge', 'jquery', 'swalComponent'],
function(ko, template, bridge, $, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.especialidades = ko.observableArray([]);
    self.hasResult = ko.observable(false);

    self.exclude = function(especialidade) {
      var errorTitle = 'Não foi possível excluir especialidade';
      swalComponent.removeInstanceWarning("/api/especialidades/" + especialidade.id + "/" + localStorage.getItem('current_user_id'), errorTitle, function(){
        init();
      });
    };

    var mapResponseToEspecialidades = function(especialidades) {
      if(!especialidades.length) {
        self.hasResult(true);
        return self.especialidades([]);
      }

      self.hasResult(false);
      var especialidades = especialidades.map(function(especialidade) {
        return {
          id : especialidade.id,
          nome : especialidade.nome,
        };
      });

      self.especialidades(especialidades);
    };

    var init = function() {
      bridge.post("/api/especialidades/by_profissional", { profissional : localStorage.getItem('current_user_id') })
      .then(function(response) {
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
