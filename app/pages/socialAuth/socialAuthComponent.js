define(['ko', 'text!socialAuthTemplate', 'bridge', 'auth0'],
function(ko, template, bridge, auth0) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = new auth0({
      domain: 'pedrobelli.auth0.com',
      clientID: 'hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM'
    });

    self.result = self.auth0.parseHash('access_token=' + params.token);
    self.token = localStorage.getItem('id_token');

    if (localStorage.getItem('old_id_token') == self.result.idToken) {
      window.location.hash = '#home';
    } else if (self.token) {
      window.location.hash = '#home';
    } else if (self.result && self.result.idToken) {
      self.auth0.getProfile(self.result.idToken, function (err, profile) {

        // localStorage.setItem('id_token', self.result.idToken);
        console.log(profile);
      });
      // localStorage.setItem('id_token', self.result.idToken);

      window.location.hash = '#home';
    }
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Login"
    }
  };
});
