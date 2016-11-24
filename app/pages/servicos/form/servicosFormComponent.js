define(['ko', 'text!./servicosFormTemplate.html', 'bridge', 'jquery', 'swalComponentForm', 'maskComponentForm'],
function(ko, template, bridge, $, swalComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/detalhe_servicos/new";
    var UPDATE_PATH = "/api/detalhe_servicos/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.duracao = ko.observable();
    self.valor = ko.observable();
    self.especialidade = ko.observable();
    self.pageMode = params.name == 'new' ? 'Novo Serviço' : 'Editar Serviço';
    self.errorTitle = params.name == 'new' ? "Ocorreu um erro na criação de serviço!" : "Ocorreu um erro na atualização de serviço!";

    self.especialidades = ko.observableArray([]);

    self.cancelar = function(){
      return window.location.hash = "#servicos";
    };

    self.save = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError){
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
      })
      .done(function(){
        window.location.hash = "#servicos"
      });
    };

    var validate = function(){
      var errors = []
      valid = !!self.nome();
      valid = valid && !!self.duracao();
      valid = valid && !!self.valor();
      valid = valid && !!self.especialidade();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com a edição de seus dados.");
      }

      return errors;
    };

    var generatePayload = function(){
      var payload = {
        nome            : self.nome(),
        duracao         : self.duracao(),
        valor           : self.valor(),
        especialidadeId : self.especialidade(),
        profissionalId : localStorage.getItem('current_user_id')
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      maskComponent.applyCurrencyMask();
      maskComponent.applyNumberMask();

      bridge.get("/api/detalhe_servicos/form_options/" + localStorage.getItem('current_user_id'))
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
          return bridge.get("/api/detalhe_servicos/get/"+params.id).then(function(response){
            if (!response)
              return;

            self.nome(response.detalheServico.servico.nome);
            self.duracao(response.detalheServico.duracao);
            self.valor(response.detalheServico.valor);
            self.especialidade(response.detalheServico.servico.especialidadeId);
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
