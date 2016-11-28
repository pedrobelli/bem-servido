define(['ko', 'text!especialidadesFormTemplate', 'bridge', 'jquery', 'swalComponentForm'],
function(ko, template, bridge, $, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/especialidades/new";
    var UPDATE_PATH = "/api/especialidades/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.pageMode = params.name == 'new' ? 'Nova Especialidade' : 'Editar Especialidade';
    self.errorTitle = params.name == 'new' ? "Ocorreu um erro na criação de especialidade!" : "Ocorreu um erro na atualização de especialidade!";
    self.errorMessageApend = params.name == "new" ? ' criação da especialidade.' : ' edição da especialidade.';

    self.cancelar = function(){
      return window.location.hash = "#especialidades";
    };

    self.save = function() {
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError) {
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
      })
      .done(function() {
        window.location.hash = "#especialidades"
      });
    };

    var validate = function(){
      var errors = []
      valid = !!self.nome();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com a" + self.errorMessageApend);
      }

      return errors;
    };

    var generatePayload = function() {
      var payload = {
        nome           : self.nome(),
        profissionalId : localStorage.getItem('current_user_id')
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function() {
      if (isEditMode()) {
        bridge.get("/api/especialidades/get/"+params.id).then(function(response) {
          if(!response)
            return;

          self.nome(response.especialidade.nome);
        });
      }
    };
    var isEditMode = function() {
      return params.name == "edit"
    }

      init();
    }
  return {
    viewModel : viewModel,
    template : template,
    title: function(params) {
      return "Especialidades form"
    }
  };
});
