define(['ko', 'text!pesquisaTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var init = function(){
      $('select').material_select();
      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
      });
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
