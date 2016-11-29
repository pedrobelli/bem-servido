define(['ko', 'text!formSenhaTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm', 'auth0Component'],
function(ko, template, $, bridge, maskComponent, swalComponent, auth0Component) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = auth0Component.createAuth0Instance();

    var route = localStorage.getItem('current_user_role') == 1 ? "#clientes/perfil" : "#profissionais/perfil";

    self.email = ko.observable();
    self.actualPassword = ko.observable();
    self.newPassword = ko.observable();
    self.comfirmNewPassword = ko.observable();

    self.errorTitle = "Ocorreu um erro na atualização de seu email!";

    self.cancelar = function(){
      return window.location.hash = route;
    };

    self.salvar = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      self.auth0.login({
        connection: 'Username-Password-Authentication',
        email: self.email(),
        password: self.actualPassword(),
        sso: false
      }, function(err, result) {
        if (!!err) {
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Sua senha atual está incorreta. Por favor, tente novamente.."])
        } else {
          self.auth0.getProfile(result.idToken, function (err, profile) {
            if (localStorage.getItem('current_user_auth_id') == profile.user_id) {
              auth0Component.updateAuth0User(generatePayload(), self.errorTitle)
            } else {
              swalComponent.simpleErrorAlertWithTitle(self.errorTitle, [])
            }
          });
        }
      });


    };

    var validate = function(){
      var errors = []
      valid = !!self.actualPassword();
      valid = !!self.newPassword();
      valid = !!self.comfirmNewPassword();

      if (!valid) {
        errors.push("É necessário preencher todos os campos.");
      }

      if ((!!self.newPassword() && !!self.comfirmNewPassword()) && self.newPassword() != self.comfirmNewPassword()) {
        errors.push("Verifique se as senhas são as mesmas.");
      }

      if (!!self.password() && self.password().length < 5) {
        errors.push("Sua senha deve conter pelo menos 5 caracteres.");
      }

      if ((!!self.actualPassword() && !!self.newPassword()) && self.actualPassword() == self.newPassword()) {
        errors.push("Sua nova senha não pode ser igual a antiga.");
      }

      return errors;
    };

    var generatePayload = function(){
      var payload = {
        "password": self.newPassword(),
        "verify_password": true,
        "connection": 'Username-Password-Authentication',
        "client_id": "hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM"
      };

      return payload;
    };

    var init = function(){
      self.auth0.getProfile(localStorage.getItem('id_token'), function (err, profile) {
          self.email(profile.email)
      });
    };

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Atualizar senha"
    }
  };
});
