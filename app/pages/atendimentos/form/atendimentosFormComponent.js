define(['ko', 'text!./atendimentosFormTemplate.html', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    var pageHeaderText = params.name == 'new' ? 'Novo Atendimento' : 'Editar Atendimento'
    var CREATE_PATH = "/api/atendimentos/new";
    var UPDATE_PATH = "/api/atendimentos/edit/" + params.id;

    self.id = ko.observable(params.id);
    self.data = ko.observable();
    self.initTime = ko.observable();
    self.valorTotal = ko.observable();
    self.duracao = ko.observable();
    self.prestador = ko.observable();
    self.servico = ko.observable();
    self.cliente = ko.observable();
    self.pageMode = ko.observable(pageHeaderText);

    self.prestadores = ko.observableArray([]);
    self.servicos = ko.observableArray([]);
    self.clientes = ko.observableArray([]);

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
      var dia = parseInt(self.data().substring(0, 2));
      var mes = parseInt(self.data().substring(3, 5)) - 1;
      var ano = parseInt(self.data().substring(6, 10));
      var hora = parseInt(self.initTime().substring(0, 2));
      var minuto = parseInt(self.initTime().substring(3, 5));

      var data = new Date(ano, mes, dia, hora, minuto, 0, 0);

      var payload = {
        data          : data,
        valorTotal         : self.valorTotal(),
        duracao       : self.duracao(),
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

        var servicos = response.servicos.map(function(servico){
          return {
            id   : servico.id,
            nome : servico.descricao
          }
        });

        var clientes = response.clientes.map(function(cliente){
          return {
            id   : cliente.id,
            nome : cliente.nome
          }
        });

        self.prestadores(prestadores);
        self.servicos(servicos);
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
