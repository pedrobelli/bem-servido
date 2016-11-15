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
        uuids.push(identity.user_id);
      });
      payload.uuids = JSON.stringify(uuids);

      bridge.post(url, payload).done(function(response){
        if (!response.cliente && !response.profissional) {
          localStorage.setItem('id_token', self.result.idToken);
          localStorage.setItem('exp', self.result.idTokenPayload.exp);
          // TODO arrumar esse redirecionamento bosta
          window.location.hash = "#home";
        } else if (profile.user_metadata.role == '1') {
          mapClienteToLocalStorage(response, profile);
        } else {
          mapProfissionalToLocalStorage(response, profile);
        }
      });
    }

    var mapClienteToLocalStorage = function(response, profile)  {
      localStorage.setItem('id_token', self.result.idToken);
      localStorage.setItem('current_user_id', response.cliente.id);
      localStorage.setItem('current_user_auth_id', response.cliente.uuid);
      localStorage.setItem('current_user_name', response.cliente.nome);
      localStorage.setItem('current_user_role', profile.user_metadata.role);
      localStorage.setItem('exp', self.result.idTokenPayload.exp);
      // TODO arrumar esse redirecionamento bosta
      window.location.hash = "#home";
    }

    var mapProfissionalToLocalStorage = function(response, profile)  {
      localStorage.setItem('id_token', self.result.idToken);
      localStorage.setItem('current_user_id', response.profissional.id);
      localStorage.setItem('current_user_auth_id', response.profissional.uuid);
      localStorage.setItem('current_user_name', response.profissional.nome);
      localStorage.setItem('current_user_role', profile.user_metadata.role);
      localStorage.setItem('exp', self.result.idTokenPayload.exp);
      // TODO arrumar esse redirecionamento bosta
      window.location.hash = "#home";
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
