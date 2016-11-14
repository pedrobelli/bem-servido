define(['ko', 'text!dadosUsuarioTemplate', 'jquery', 'maskComponentForm'],
function(ko, template, $, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.email = ko.observable();
    self.password = ko.observable();
    self.confirmPassword = ko.observable();

    self.validate = function() {
      var errors = []
      valid = !!self.email();
      valid = valid && !!self.password();
      valid = valid && !!self.confirmPassword();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com seu cadastro.")
      }

      if ((!!self.password() && !!self.confirmPassword()) && self.password() != self.confirmPassword()) {
        errors.push("Verifique se as senhas são as mesmas.")
      }

      return errors;
    };

    self.show = function() {
      $('#dados-usuario').fadeIn();
    };

    self.hide = function() {
      $('#dados-usuario').fadeOut();
    };

    self.subscribe = function() {
      maskComponent.applyEmailMask();
    };

    self.cleanFields = function() {
      self.email(undefined);
      self.password(undefined);
      self.confirmPassword(undefined);
    };

    self.generatePayload = function(payload){
      payload.email = self.email();
      payload.password = self.password();

      return payload;
    };

  }

  var instance = new viewModel();

  ko.components.register('dados-usuario-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
