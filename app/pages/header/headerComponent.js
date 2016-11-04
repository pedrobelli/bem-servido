define(['ko', 'text!headerTemplate', 'materialize', 'waves'],
function(ko, template, materialize, waves) {

  var viewModel = function(params) {
    var self = this;

    self.home = ko.observable(false);

    if (params.header == "home") {
      self.home(true);
      $("#site-header").addClass("top-header");
      $("#site-nav").removeClass("orange");
    } else if (params.header == "orange") {
      $("#site-header").removeClass("top-header");
      $("#site-nav").addClass("orange");
    }

    init = function() {
      Waves.displayEffect();
      $(".button-collapse").sideNav();
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
  };
});
