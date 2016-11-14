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
      console.log(profile);
      var payload = {};
      var uuids = [];

      profile.identities.forEach(function(identity) {
        uuids.push(identity.user_id);
      });
      payload.uuids = JSON.stringify(uuids);

      bridge.post("/api/profissionais/by_uuid", payload).done(function(response){
        console.log(response);
        // TODO arrumar esse redirecionamento bosta
        // window.location.hash = "#home"
      });




      // localStorage.setItem('id_token', result.idToken);
      // localStorage.setItem('current_user_id', payload.profissional.id);
      // localStorage.setItem('current_user_auth_id', payload.profissional.uuid);
      // localStorage.setItem('current_user_name', payload.profissional.nome);
      // localStorage.setItem('current_user_role', 2);
      // localStorage.setItem('exp', result.idTokenPayload.exp);


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
