define(['ko', 'text!loginTemplate', 'bridge', 'auth0Component', 'swalComponent'],
function(ko, template, bridge, auth0Component, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.email = ko.observable();
    self.password = ko.observable();

    self.auth0 = auth0Component.createAuth0Instance();

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
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Não foi possível realizar login, usuário ou senha incorretos."])
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
        uuids.push(identity.provider + '|' + identity.user_id);
      });
      payload.uuids = JSON.stringify(uuids);

      bridge.post(url, payload).done(function(response){
        if (profile.user_metadata.role == '1') {
          auth0Component.mapClienteToLocalStorage(response, result, profile);
        } else {
          auth0Component.mapProfissionalToLocalStorage(response, result, profile);
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
