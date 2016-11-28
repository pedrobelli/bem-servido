define(['ko', 'text!qualificacoesProfissionalAbertasTemplate', 'bridge', 'qualificacoesProfissionalPartialComponent'],
function(ko, template, bridge, qualificacoesProfissionalPartialComponent) {

  var viewModel = function(params) {
    var self = this;

    self.nome = ko.observable();

    qualificacoesProfissionalPartialComponent.subscribe(params.id);

    var init = function() {
      return bridge.get("/api/profissionais/get/" + params.id)
      .then(function(response){
        var profissional = response.profissional;

        self.nome(profissional.nome);

      });
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Qualificações do Profissional"
    }
  };
});
