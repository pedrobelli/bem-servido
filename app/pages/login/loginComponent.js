define(['ko', 'text!loginTemplate', 'bridge', 'auth0', 'swalComponent'],
function(ko, template, bridge, auth0, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.email = ko.observable();
    self.password = ko.observable();

    self.auth0 = new auth0({
      domain: 'pedrobelli.auth0.com',
      clientID: 'hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM'
    });

    self.errorTitle = "Ocorreu um erro no login!"

    self.facebookLogin = function(){
      self.auth0.login({
        connection: 'facebook',
        responseType: 'token'
      }, function(err) {
        if (!!err) {
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Não foi possível realizar login com o Facebook."])
        }
      });
    };

    self.gmailLogin = function(){
      self.auth0.login({
        connection: 'google-oauth2',
        responseType: 'token'
      }, function(err) {
        if (!!err) {
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Não foi possível realizar login com sua conta Google."])
        }
      });
    };

    self.login = function(){
      self.auth0.login({
        connection: 'Username-Password-Authentication',
        email: self.email(),
        password: self.password(),
        sso: false
      }, function(err, result) {
        if (!!err) {
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Não foi possível realizar login usuário ou senha incorretos."])
        } else {
          self.auth0.getProfile(result.idToken, function (err, profile) {
            setLocalStorageAndRedirect(result, profile);
          });
        }
      });
    };

    var setLocalStorageAndRedirect = function(result, profile) {
      var payload = {};
      var uuids = [];
      var url = profile.user_metadata.role == '1' ? "/api/clientes/by_uuid" : "/api/profissionais/by_uuid";

      profile.identities.forEach(function(identity) {
        uuids.push(identity.user_id);
      });
      payload.uuids = JSON.stringify(uuids);

      bridge.post(url, payload).done(function(response){
        if (profile.user_metadata.role == '1') {
          mapClienteToLocalStorage(response, result, profile);
        } else {
          mapProfissionalToLocalStorage(response, result, profile);
        }
      });
    }

    var mapClienteToLocalStorage = function(response, result, profile)  {
      localStorage.setItem('id_token', result.idToken);
      localStorage.setItem('current_user_id', response.cliente.id);
      localStorage.setItem('current_user_auth_id', response.cliente.uuid);
      localStorage.setItem('current_user_name', response.cliente.nome);
      localStorage.setItem('current_user_role', profile.user_metadata.role);
      localStorage.setItem('exp', result.idTokenPayload.exp);
      // TODO arrumar esse redirecionamento bosta
      return window.location.hash = "#home";
    }

    var mapProfissionalToLocalStorage = function(response, result, profile)  {
      localStorage.setItem('id_token', result.idToken);
      localStorage.setItem('current_user_id', response.profissional.id);
      localStorage.setItem('current_user_auth_id', response.profissional.uuid);
      localStorage.setItem('current_user_name', response.profissional.nome);
      localStorage.setItem('current_user_role', profile.user_metadata.role);
      localStorage.setItem('exp', result.idTokenPayload.exp);
      // TODO arrumar esse redirecionamento bosta
      return window.location.hash = "#home";
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
