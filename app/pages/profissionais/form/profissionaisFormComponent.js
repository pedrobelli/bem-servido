define(['ko', 'text!./profissionaisFormTemplate.html', 'bridge', 'jquery', 'materialize',
function(ko, template, bridge, $, materialize) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/profissionais/new";
    var UPDATE_PATH = "/api/profissionais/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.pageMode = params.name == 'new' ? 'Novo Profissional' : 'Editar Profissional';

    var init = function(){

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
