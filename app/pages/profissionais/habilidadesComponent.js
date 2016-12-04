define(['ko', 'text!habilidadesTemplate', 'bridge', 'jquery', 'swalComponent'],
function(ko, template, bridge, $, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.habilidades = ko.observableArray([]);
    self.hasResult = ko.observable(false);

    self.exclude = function(habilidade) {
      var errorTitle = 'Não foi possível excluir habilidade';
      swalComponent.removeInstanceWarning("/api/habilidades/" + habilidade.id + "/" + localStorage.getItem('current_user_id'), errorTitle, function(){
        init();
      });
    };

    var mapResponseToHabilidades = function(habilidades) {
      if(!habilidades.length) {
        self.hasResult(true);
        return self.habilidades([]);
      }

      self.hasResult(false);
      var habilidades = habilidades.map(function(habilidade) {
        return {
          id : habilidade.id,
          nome : habilidade.nome,
        };
      });

      self.habilidades(habilidades);
    };

    var init = function() {
      bridge.post("/api/habilidades/by_profissional", { profissional : localStorage.getItem('current_user_id') })
      .then(function(response) {
        mapResponseToHabilidades(response.habilidades);
      });
    };

    init();
  };

  return {
    viewModel:viewModel,
    template: template,
    title: function(params) {
      return "Habilidades"
    }
  };
});
