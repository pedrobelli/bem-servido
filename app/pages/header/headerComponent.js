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

    self.logout = function(){
      if (localStorage.getItem('id_token')) {
        localStorage.setItem('old_id_token', localStorage.getItem('id_token'));
        localStorage.removeItem('id_token');
        localStorage.removeItem('current_user_id');
        localStorage.removeItem('current_user_auth_id');
        localStorage.removeItem('current_user_name');
        localStorage.removeItem('current_user_role');
        localStorage.removeItem('exp');
        return window.location = '/#home';
      }
    };

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
