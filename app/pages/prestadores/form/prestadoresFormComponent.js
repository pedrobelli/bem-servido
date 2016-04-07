define(['ko', 'text!./prestadoresFormTemplate.html', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Prestador' : 'Editar Prestador';
    var CREATE_PATH = "/api/prestadores";
    var UPDATE_PATH = "/api/prestadores/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.email = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.email();

      return valid;
    });


    self.save = function(){
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError){
        console.log("Erros: ", context.errors);
      })
      .done(function(){
        window.location.hash = "prestadores"
      });
    };

    var generatePayload = function(){
      var payload = {
        nome  : self.nome(),
        email : self.email()
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      if (isEditMode()) {
        bridge.get("/api/prestadores/"+params.id)
        .then(function(response){
          if (!response)
            return;

          self.nome(response.prestador.nome);
          self.email(response.prestador.email);

        });
      }
    };

    var isEditMode = function(){
        return params.name == "edit"
    }

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Prestadores form"
    }
  };
});
