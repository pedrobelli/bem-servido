define(['ko', 'text!./atendimentosFormTemplate.html', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Atendimento' : 'Editar Atendimento'
    var CREATE_PATH = "/api/atendimentos";
    var UPDATE_PATH = "/api/atendimentos/" + params.id;

    self.id = ko.observable(params.id);
    self.data = ko.observable();
    self.preco = ko.observable();
    self.duracao = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.validForm = ko.pureComputed(function() {
      return !!self.data();
    });

    self.save = function() {
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload()).fail(function(context, errorMessage, serverError) {
        console.log("Errors: ", context.errors);
      }).done(function() {
        window.location.hash = "atendimentos"
      });
    };
    var generatePayload = function() {
      var payload = {
        data : self.data(),
        preco : self.preco(),
        duracao : self.duracao()
      };

      if (isEditMode()) payload.id = params.id;
      return payload;
    };

    var init = function() {
      if(isEditMode()) {
        bridge.get("/api/atendimentos/" + params.id).then(function(response) {
          if(!response)
            return;

          self.data(response.atendimento.data);
          self.preco(response.atendimento.preco);
          self.duracao(response.atendimento.duracao);
        });
      }
    };

    var isEditMode = function() {
      return params.data == "edit"
    }
      init();
    }
    return {
      viewModel : viewModel,
      template : template,
      title: function(params) {
        return "Atendimentos form"
      }
    };
});
