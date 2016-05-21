define(['ko', 'text!./atendimentosFormTemplate.html', 'bridge', '../../shared/moment/momentComponent', '../../shared/swal/swalComponent'],
function(ko, template, bridge, momentComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/atendimentos/new";
    var UPDATE_PATH = "/api/atendimentos/edit/" + params.id;

    self.id = ko.observable(params.id);
    self.data = ko.observable();
    self.iniTime = ko.observable();
    self.finTime = ko.observable();
    self.valorTotal = ko.observable();
    self.duracao = ko.observable();
    self.prestador = ko.observable();
    self.servico = ko.observable();
    self.cliente = ko.observable();
    self.pageMode = params.name == 'new' ? 'Novo Atendimento' : 'Editar Atendimento';

    self.prestadores = ko.observableArray([]);
    self.servicos = ko.observableArray([]);
    self.clientes = ko.observableArray([]);

    self.validForm = ko.pureComputed(function() {
      return !!self.data();
    });

    self.save = function() {
      var path = isEditMode() ? UPDATE_PATH : CREATE_PATH;

      bridge.post(path, generatePayload())
      .fail(function(context, errorMessage, serverError) {
        var errorTitle = params.name == 'new' ? 'Não foi possível criar atendimento' : 'Não foi possível alterar atendimento';
        swalComponent.errorAlertWithTitle(errorTitle, context.errors.errors);
      }).done(function() {
        window.location.hash = "atendimentos"
      });
    };

    var generatePayload = function() {
      var payload = {
        dataInicio    : momentComponent.convertStringToDateTime(self.data(), self.iniTime()),
        dataFim       : momentComponent.convertStringToDateTime(self.data(), self.iniTime()),
        duracao       : self.duracao(),
        valorTotal    : self.valorTotal(),
        funcionarioId : self.prestador(),
        servicoId     : self.servico(),
        clienteId     : self.cliente()
      };

      if (isEditMode()) payload.id = params.id;

      return payload;
    };

    var init = function() {
      bridge.get("/api/atendimentos/form_options")
      .then(function(response){
        var prestadores = response.funcionarios.map(function(funcionario){
          return {
            id   : funcionario.id,
            nome : funcionario.nome
          }
        });

        var clientes = response.clientes.map(function(cliente){
          return {
            id   : cliente.id,
            nome : cliente.nome
          }
        });

        self.prestadores(prestadores);
        self.clientes(clientes);
      })
      .then(function(){
        if(isEditMode()) {
          bridge.get("/api/atendimentos/" + params.id).then(function(response) {
            if(!response)
              return;

            self.data(response.atendimento.data);
            self.valorTotal(response.atendimento.valorTotal);
            self.duracao(response.atendimento.duracao);
          });
        }
      })
      .then(function(){
        $('select').material_select();
      });
    };

    var isEditMode = function() {
      return params.name == "edit"
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
