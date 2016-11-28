define(['ko', 'text!socialAuthTemplate', 'bridge', 'auth0Component'],
function(ko, template, bridge, auth0Component) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = auth0Component.createAuth0Instance();

    self.result = self.auth0.parseHash('access_token=' + params.token);
    self.token = localStorage.getItem('id_token');

    if (localStorage.getItem('old_id_token') == self.result.idToken) {
      window.location.hash = '#home';
    } else if (self.token) {
      window.location.hash = '#home';
    } else if (self.result) {
      self.auth0.getProfile(self.result.idToken, function (err, profile) {
        setLocalStorageAndRedirect(profile);
      });
    }

    var setLocalStorageAndRedirect = function(profile) {
      var payload = {};
      var uuids = [];
      var url = profile.user_metadata.role == '1' ? "/api/clientes/by_uuid" : "/api/profissionais/by_uuid";

      profile.identities.forEach(function(identity) {
        uuids.push(identity.provider + '|' + identity.user_id);
      });
      payload.uuids = JSON.stringify(uuids);

      bridge.post(url, payload).done(function(response){
        if (!response.cliente && !response.profissional) {
          localStorage.setItem('id_token', self.result.idToken);
          localStorage.setItem('exp', self.result.idTokenPayload.exp);
          localStorage.setItem('current_user_auth_id', profile.user_id);
          localStorage.setItem('current_user_role', profile.user_metadata.role);
          window.location.hash = "#home";
        } else if (profile.user_metadata.role == '1') {
          auth0Component.mapClienteToLocalStorage(response, self.result, profile);
        } else {
          auth0Component.mapProfissionalToLocalStorage(response, self.result, profile);
        }
      });
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
