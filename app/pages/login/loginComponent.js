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

    self.facebookLogin = function(){
      self.auth0.login({
        connection: 'facebook',
        responseType: 'token'
      }, function(err) {
        showError("Não foi possível realizar login com o Facebook.");
      });
    };

    self.gmailLogin = function(){
      self.auth0.login({
        connection: 'google-oauth2',
        responseType: 'token'
      }, function(err) {
        showError("Não foi possível realizar login com sua conta Google.");
      });
    };

    self.login = function(){
      self.auth0.login({
        connection: 'Username-Password-Authentication',
        email: self.email(),
        password: self.password(),
        sso: false
      }, function(err, result) {
        if (!err) {
          self.auth0.getProfile(result.idToken, function (err, profile) {
            setLocalStorageAndRedirect(result, profile);
          });
        } else {
          showError("Não foi possível realizar login usuário ou senha incorretos.");
        }
      });
    };

    var showError = function(errorMessage) {
      if (!!errorMessage) {
        swalComponent.simpleErrorAlertWithTitle(errorMessage, [])
      }
    }

    var setLocalStorageAndRedirect = function(result, profile) {
      if (result && result.idToken) {
        console.log(profile);
        // localStorage.setItem('id_token', result.idToken);


      }
    }

    self.signup = function(){
      self.auth0.signup({
        connection: 'Username-Password-Authentication',
        email: self.email(),
        password: self.password(),
        "user_metadata": {
          "role": 1
        },
        auto_login: false
      }, function (err) {
        console.log("AQUI");
        console.log(err);
      });
    };

  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Login"
    }
  };
});
