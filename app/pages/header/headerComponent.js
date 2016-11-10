define(['ko', 'text!headerTemplate', 'materialize', 'waves'],
function(ko, template, materialize, waves) {

  var viewModel = function(params) {
    var self = this;

    self.home = ko.observable(false);

    if (params.header == "home") {
      self.home(true);
      $("#site-header").addClass("topheader-home");
      $("#site-nav").removeClass("topheader-default");
      $("#site-nav").removeClass("orange");
    } else if (params.header == "orange") {
      $("#site-header").removeClass("topheader-home");
      $("#site-header").removeClass("topheader-default");
      $("#site-nav").addClass("orange");
    } else if (params.header == "default") {
      $("#site-header").removeClass("topheader-home");
      $("#site-header").addClass("topheader-default");
      $("#site-nav").removeClass("orange");
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
