define(['ko', 'text!pesquisaTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var init = function(){
      $('select').material_select();
      $('.datepicker').pickadate({});
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Pesquisa"
    }
  };
});
