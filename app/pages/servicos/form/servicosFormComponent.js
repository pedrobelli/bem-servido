define(['ko', 'text!./servicosFormTemplate.html', 'bridge', 'jquery', 'materialize', '../../shared/swal/swalComponent',
'../../shared/mask/maskComponent'],
function(ko, template, bridge, $, materialize, swalComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/servicos/new";
    var UPDATE_PATH = "/api/servicos/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.duracao = ko.observable();
    self.valor = ko.observable();
    self.especialidade = ko.observable();
    self.pageMode = params.name == 'new' ? 'Novo Serviço' : 'Editar Serviço';

    self.especialidades = ko.observableArray([]);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.duracao();
      valid = valid && !!self.valor();
      valid = valid && !!self.especialidade();

      return valid;
    });

    self.save = function(){
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError){
        var errorTitle = params.name == 'new' ? 'Não foi possível criar serviço' : 'Não foi possível alterar serviço';
        swalComponent.errorAlertWithTitle(errorTitle, context.errors);
      })
      .done(function(){
        window.location.hash = "servicos"
      });
    };

    var generatePayload = function(){
      var payload = {
        nome            : self.nome(),
        duracao         : self.duracao(),
        valor           : self.valor(),
        especialidadeId : self.especialidade()
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      maskComponent.applyCurrencyMask();

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
          return bridge.get("/api/servicos/get/"+params.id).then(function(response){
            if (!response)
              return;

            self.nome(response.servico.nome);
            self.duracao(response.servico.duracao);
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
