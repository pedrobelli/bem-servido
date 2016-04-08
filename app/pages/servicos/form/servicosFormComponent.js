define(['ko', 'text!./servicosFormTemplate.html', 'bridge', 'jquery', 'materialize'],
function(ko, template, bridge, $, materialize) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Serviço' : 'Editar Serviço';
    var CREATE_PATH = "/api/servicos";
    var UPDATE_PATH = "/api/servicos/"+params.id;

    self.id = ko.observable(params.id);
    self.descricao = ko.observable();
    self.valor = ko.observable();
    self.especialidade = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.especialidades = ko.observableArray([]);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.descricao();
      valid = valid && !!self.valor();
      valid = valid && !!self.especialidade();

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
        descricao     : self.descricao(),
        valor         : self.valor(),
        especialidadeId : self.especialidade()
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      bridge.get("/api/servicos/form_options")
      .then(function(response){
        var especialidades = response.especialidades.map(function(especialidade){
          return {
            id   : especialidade.id,
            nome : especialidade.nome
          }
        });

        self.especialidades(especialidades);
      })
      .then(function(){
        if (isEditMode()) {
          return bridge.get("/api/servicos/get/"+params.id)
          .then(function(response){
            if (!response)
              return;

            self.descricao(response.servico.descricao);
            self.valor(response.servico.valor);
            self.especialidade(response.servico.especialidadeId);
          });
        }

      })
      .then(function(){
        $('select').material_select();
      });

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
