define(['ko', 'text!./clientesFormTemplate.html', 'bridge', 'jquery', 'materialize'],
function(ko, template, bridge, $, materialize) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Cliente' : 'Editar Cliente';
    var CREATE_PATH = "/api/clientes/new";
    var UPDATE_PATH = "/api/clientes/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.email = ko.observable();
    self.telefone = ko.observable();
    self.senha = ko.observable();
    self.confirmSenha = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.email();

      if (isEditMode()) {
        valid = valid && !!self.senha();
      } else {
        valid = valid && (!!self.senha() && !!self.confirmSenha());
      }
      return valid;
    });

    self.save = function(){
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      if (!isEditMode() && (self.senha() != self.confirmSenha())) {
        console.log("Erro: Os campos de senha estão diferentes!");
        return;
      }

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError){
        console.log("Erros: ", context.errors);
      })
      .done(function(){
        window.location.hash = "clientes"
      });
    };

    var generatePayload = function(){
      var payload = {
        nome     : self.nome(),
        email    : self.email(),
        telefone : self.telefone(),
        senha    : self.senha()
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      if (isEditMode()) {
        bridge.get("/api/clientes/get/"+params.id)
        .then(function(response){
          if (!response)
            return;

          self.nome(response.cliente.nome);
          self.email(response.cliente.email);
          self.telefone(response.cliente.telefone);
          self.senha(response.cliente.senha);
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
      return "Clientes form"
    }
  };
});
