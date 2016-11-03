define(['ko', 'text!homeHeaderTemplate', 'text!orangeHeaderTemplate', 'bridge', "materialize", "waves"],
function(ko, homeHeader, orangeHeader, bridge, materialize, waves) {

  var template = {}

  var viewModel = function(params) {
    console.log(params);
    var self = this;

    if (params.header == "home") {
    	template = "home";
    } else if (params.header == "orange") {
    	template = "orange";
    }

    init = function() {
      Waves.displayEffect();
      $(".button-collapse").sideNav();
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: homeHeader,
  };
});
