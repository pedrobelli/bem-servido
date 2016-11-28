define(['ko', 'text!qualificacoesProfissionalTemplate', 'qualificacoesProfissionalPartialComponent'],
function(ko, template, qualificacoesProfissionalPartialComponent) {

  var viewModel = function(params) {
    var self = this;

    qualificacoesProfissionalPartialComponent.subscribe(localStorage.getItem('current_user_id'));
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Qualificações do Profissional"
    }
  };
});
