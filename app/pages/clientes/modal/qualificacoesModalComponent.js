define(['ko', 'text!qualificacoesClienteTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    self.nota = ko.observable();

    self.salvar  = function() {
      console.log(self.nota());
    };

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
      return "qualificacoesCliente"
    }
  };
});
