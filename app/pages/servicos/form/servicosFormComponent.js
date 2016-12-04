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
    self.habilidade = ko.observable();
    self.pageMode = params.name == 'new' ? 'Novo Serviço' : 'Editar Serviço';
    self.errorTitle = params.name == 'new' ? "Ocorreu um erro na criação de serviço!" : "Ocorreu um erro na atualização de serviço!";
    self.errorMessageApend = params.name == "new" ? ' criação do serviço.' : ' edição do serviço.';

    self.habilidades = ko.observableArray([]);

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
      valid = valid && !!self.habilidade();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com a" + self.errorMessageApend);
      }

      return errors;
    };

    var generatePayload = function(){
      var payload = {
        nome            : self.nome(),
        duracao         : self.duracao(),
        valor           : self.valor(),
        habilidadeId : self.habilidade(),
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
        var habilidades = response.habilidades.map(function(habilidade){
          return {
            id   : habilidade.id,
            nome : habilidade.nome
          }
        });

        self.habilidades(habilidades);
      })
      .then(function(){
        if (isEditMode()) {
          return bridge.get("/api/detalhe_servicos/get/"+params.id).then(function(response){
            if (!response)
              return;

            self.nome(response.detalheServico.servico.nome);
            self.duracao(response.detalheServico.duracao);
            self.valor(response.detalheServico.valor);
            self.habilidade(response.detalheServico.servico.habilidadeId);
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
