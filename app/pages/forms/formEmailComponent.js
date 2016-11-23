define(['ko', 'text!formEmailTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm', 'auth0Component'],
function(ko, template, $, bridge, maskComponent, swalComponent, auth0Component) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = auth0Component.createAuth0Instance();

    self.email = ko.observable();

    self.errorTitle = "Ocorreu um erro na atualização de seu email!";

    self.cancelar = function(){
      return window.location.hash = "#clientes/perfil";
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
