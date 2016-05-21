define(['ko', 'text!./funcionariosFormTemplate.html', 'bridge', 'jquery', 'materialize', '../../shared/swal/swalComponent',
'../../shared/mask/maskComponent'],
function(ko, template, bridge, $, materialize, swalComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/funcionarios/new";
    var UPDATE_PATH = "/api/funcionarios/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.email = ko.observable();
    self.especialidades = ko.observable();
    self.servicosSelecionados = ko.observable();
    self.especialidadesSelecionadas = ko.observable();
    self.pageMode = params.name == 'new' ? 'Novo Funcionario' : 'Editar Funcionario';

    self.servicos = ko.observableArray([]);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.email();
      valid = valid && !!self.servicosSelecionados();
      valid = valid && !!self.especialidadesSelecionadas();

      return valid;
    });

    self.servicosSelecionadosChange = ko.computed(function(){
      if (!!self.servicosSelecionados()) {
        selectEspecialidades(self.servicosSelecionados());
      }
    });

    self.save = function(){
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError){
        var errorTitle = params.name == 'new' ? 'Não foi possível criar funcionário' : 'Não foi possível alterar funcionário';
        swalComponent.errorAlertWithTitle(errorTitle, context.errors);
      })
      .done(function(){
        window.location.hash = "funcionarios"
      });
    };

    var generatePayload = function(){
      var payload = {
        nome           : self.nome(),
        email          : self.email(),
        servicos       : JSON.stringify(self.servicosSelecionados()),
        especialidades : JSON.stringify(self.especialidadesSelecionadas())
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var selectEspecialidades = function(servicos){
      if (!!servicos && servicos.length > 0) {
        bridge.post('/api/especialidades/by_servicos', { servicos : JSON.stringify(servicos) })
        .fail(function(context, errorMessage, serverError){
          console.log("Erros: ", context.errors);
        })
        .done(function(response){
          var especialidades = ""
          var especialidadesSelecionadas = []

          response.especialidades.forEach(function(especialidade) {
            especialidades += especialidade.nome+", "
            especialidadesSelecionadas.push(especialidade.id)
          });

          self.especialidades(especialidades);
          self.especialidadesSelecionadas(especialidadesSelecionadas);
        });
      } else {
        self.especialidades(undefined);
        self.especialidadesSelecionadas(undefined);
      }
    };

    var init = function(){
      maskComponent.applyEmailMask();
      
      bridge.get("/api/funcionarios/form_options")
      .then(function(response){
        var servicos = response.servicos.map(function(servico){
          return {
            id   : servico.id,
            nome : servico.descricao
          }
        });

        self.servicos(servicos);
      })
      .then(function(){
        if (isEditMode()) {
          return bridge.get("/api/funcionarios/get/"+params.id).then(function(response){
            if (!response)
              return;

            servicosSelecionados = [];
            response.funcionario.servicos.forEach(function(servico) {
              servicosSelecionados.push(servico.id);
            });

            self.nome(response.funcionario.nome);
            self.email(response.funcionario.email);
            self.servicosSelecionados(servicosSelecionados);
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
      return "Funcionarios form"
    }
  };
});
