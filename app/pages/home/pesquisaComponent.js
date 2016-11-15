define(['ko', 'text!pesquisaTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    self.servico = ko.observable(decodeURIComponent(params.servico));
    self.cidade = ko.observable(decodeURIComponent(params.cidade));

    var init = function(){
      $('select').material_select();
      $('.datepicker').pickadate({});
      $('.collapsible').collapsible();
     $('.modal-trigger').leanModal();
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
