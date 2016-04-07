define(['ko', 'text!./servicosFormTemplate.html', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Serviço' : 'Editar Serviço';
    var CREATE_PATH = "/api/servicos";
    var UPDATE_PATH = "/api/servicos/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.valor = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.valor();

      return valid;
    });

    self.save = function(){
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError){
        console.log("Erros: ", context.errors);
      })
      .done(function(){
        window.location.hash = "servicos"
      });
    };

    var generatePayload = function(){
      var payload = {
        nome     : self.nome(),
        valor    : self.valor(),
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      if (isEditMode()) {
        bridge.get("/api/servicos/"+params.id)
        .then(function(response){
          if (!response)
            return;

          self.nome(response.servico.nome);
          self.valor(response.servico.valor);
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
      return "Serviços form"
    }
  };
});
