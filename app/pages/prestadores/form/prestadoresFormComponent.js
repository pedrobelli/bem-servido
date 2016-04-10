define(['ko', 'text!./prestadoresFormTemplate.html', 'bridge', 'jquery', 'materialize'],
function(ko, template, bridge, $, materialize) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Prestador' : 'Editar Prestador';
    var CREATE_PATH = "/api/prestadores/new";
    var UPDATE_PATH = "/api/prestadores/edit/"+params.id;

    self.id = ko.observable(params.id);
    self.nome = ko.observable();
    self.email = ko.observable();
    self.especialidades = ko.observable();
    self.servicosSelecionados = ko.observable();
    self.especialidadesSelecionadas = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.servicos = ko.observableArray([]);

    self.validForm = ko.pureComputed(function(){
      valid = !!self.nome();
      valid = valid && !!self.email();
      valid = valid && !!self.servicosSelecionados();
      valid = valid && !!self.especialidadesSelecionadas();

      return valid;
    });

    self.servicosSelecionadosChange = ko.computed(function(){
      if (!!self.servicosSelecionados() && self.servicosSelecionados().length > 0) {
        bridge.post('/api/especialidades/by_servicos', { servicos : JSON.stringify(self.servicosSelecionados()) })
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
        nome           : self.nome(),
        email          : self.email(),
        servicos       : JSON.stringify(self.servicosSelecionados()),
        especialidades : JSON.stringify(self.especialidadesSelecionadas())
      };

      if(isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function(){
      bridge.get("/api/prestadores/form_options")
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
          bridge.get("/api/prestadores/get/"+params.id)
          .then(function(response){
            if (!response)
              return;

            self.nome(response.prestador.nome);
            self.email(response.prestador.email);

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
      return "Prestadores form"
    }
  };
});
