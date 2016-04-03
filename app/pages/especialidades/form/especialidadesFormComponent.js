define(['ko', 'text!./especialidadesFormTemplate.html', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var mode = params.name == 'new' ? "Salvar" : "Editar";
    var pageHeaderText = params.name == 'new' ? 'Nova Especialidade' : 'Editar Especialidade';
    var CREATE_PATH = "/api/especialidades";
    var UPDATE_PATH = "/api/especialidades/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.saveButtonText = ko.observable(mode);
    self.pageMode = ko.observable(pageHeaderText);

    slef.validForm = ko.pureComputed(function(){
      return !!self.nome();
    });

    slef.save = function() {
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload()).fail(function(context, errorMessage, serverError) {
        console.log("Errors: ", context.errors);
      })
      .done(function() {
        window.location.hash = "especialidades"
      });
    };

    var generatePayload = function() {
      var payload = {
        nome : self.nome()
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function() {
      if (isEditMode()) {
        bridge.get("/api/especialidades/"+params.id).then(function(response) {
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
