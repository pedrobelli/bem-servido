define(['ko', 'text!agendaClienteTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

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
      return "agendaCliente"
    }
  };
});
