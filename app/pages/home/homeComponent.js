define(['ko', 'text!homeTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Home"
    }
  };
});
