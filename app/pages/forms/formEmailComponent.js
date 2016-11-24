define(['ko', 'text!formEmailTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm', 'auth0Component'],
function(ko, template, $, bridge, maskComponent, swalComponent, auth0Component) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = auth0Component.createAuth0Instance();

    var route = localStorage.getItem('current_user_role') == 1 ? "#clientes/perfil" : "#profissionais/perfil";

    self.email = ko.observable();
    self.oldEmail = ko.observable();

    self.errorTitle = "Ocorreu um erro na atualização de seu email!";

    self.cancelar = function(){
      return window.location.hash = route;
    };

    self.salvar = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      auth0Component.updateAuth0User(generatePayload(), self.errorTitle)

    };

    var validate = function(){
      var errors = []
      valid = !!self.email();

      if (!valid) {
        errors.push("É necessário preencher o campo de email.");
      }

      if (!!self.email() && !maskComponent.validateEmailFormat(self.email())) {
        errors.push("Este não é um email válido.");
      }

      if (self.email() == self.oldEmail()) {
        errors.push("Seu novo email não pode ser igual ao antigo.");
      }

      return errors;
    };

    var generatePayload = function(){
      var payload = {
        "email": self.email(),
        "verify_email": true,
        "connection": 'Username-Password-Authentication',
        "client_id": "hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM"
      };

      return payload;
    };

    var init = function(){
      self.auth0.getProfile(localStorage.getItem('id_token'), function (err, profile) {
          self.email(profile.email)
          self.oldEmail(profile.email)
      });
    };

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Atualizar dados"
    }
  };
});
