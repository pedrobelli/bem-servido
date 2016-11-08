define(['ko', 'text!profissionaisFormTemplate', 'bridge', 'swalComponentForm', "dadosProfissionalComponent",
"dadosServicoComponent", "dadosHorarioComponent"],
function(ko, template, bridge, swalComponent, dadosProfissionalComponent, dadosServicoComponent, dadosHorarioComponent) {

  var viewModel = function(params) {
    var self = this;

    self.id = ko.observable(params.id);
    self.pageMode = params.name == 'new' ? 'Novo Profissional' : 'Editar Profissional';

    var init = function(){
      setTimeout(function(){
        dadosProfissionalComponent.subscribe();
      }, 500);
    };

    var isEditMode = function(){
        return params.name == "edit"
    }

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Profissionals form"
    }
  };
});
