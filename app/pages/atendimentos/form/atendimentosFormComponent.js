define(['ko', 'text!./atendimentosFormTemplate.html', 'bridge', '../../shared/moment/momentComponent', '../../shared/swal/swalComponent',
'../../shared/mask/maskComponent', '../../shared/datepicker/datepickerComponent'],
function(ko, template, bridge, momentComponent, swalComponent, maskComponent, datepickerComponent) {

  var viewModel = function(params) {
    var self = this;

    var CREATE_PATH = "/api/atendimentos/new";
    var UPDATE_PATH = "/api/atendimentos/edit/" + params.id;

    self.id = ko.observable(params.id);
    self.data = ko.observable();
    self.iniTime = ko.observable();
    self.finTime = ko.observable("00:00");
    self.valorTotal = ko.observable();
    self.duracao = ko.observable();
    self.prestador = ko.observable();
    self.servico = ko.observable();
    self.cliente = ko.observable();
    self.pageMode = params.name == 'new' ? 'Novo Atendimento' : 'Editar Atendimento';
    self.editSemaphore = false;

    self.prestadores = ko.observableArray([]);
    self.servicos = ko.observableArray([]);
    self.clientes = ko.observableArray([]);

    self.validForm = ko.pureComputed(function() {
      return !!self.data();
    });

    self.loadServicos = ko.computed(function(){
      if (!!self.prestador() && !self.editSemaphore) {
        loadServicos();
      }
    });

    self.loadValor = ko.computed(function(){
      if (!!self.servico() && !self.editSemaphore) {
        loadValor();
      }
    });

    self.loadFinTime = ko.computed(function(){
      var reg = /^(2[0-3]|1[0-9]|0[0-9]|[^0-9][0-9]):([0-5][0-9])$/;
      if (!!self.data() && reg.test(self.iniTime()) && !!self.duracao()) {
        self.finTime(momentComponent.calculateFinTime(self.data(), self.iniTime(), self.duracao()));
      } else {
        self.finTime("00:00");
      }
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
        dataFim       : momentComponent.convertStringToDateTime(self.data(), self.finTime()),
        duracao       : self.duracao(),
        valorTotal    : self.valorTotal(),
        funcionarioId : self.prestador(),
        servicoId     : self.servico(),
        clienteId     : self.cliente()
      };

      if (isEditMode()) payload.id = params.id;

      return payload;
    };

    var mapResponseToServicos = function(servicos){
      if(!servicos) return self.servicos([]);

      self.servicosDecorator = servicos;
      var servicos = servicos.map(function(servicos){
        return {
          id    : servicos.id,
          nome  : servicos.descricao,
          valor : servicos.valor
        }
      });

      self.servicos(servicos);
      $('select').material_select();
    };

    var loadServicos = function(){
      self.servico(undefined);
      self.valorTotal(undefined);
      self.servicos([]);

      return bridge.get("/api/funcionarios/get/" + self.prestador())
      .then(function(response){
        mapResponseToServicos(response.funcionario.servicos);
      });
    };

    var loadValor = function(){
      self.valorTotal(undefined);

      var servico = self.servicos().filter(function ( servico ) {
          return servico.id === self.servico();
      })[0];

      self.valorTotal(servico.valor);
    };

    var init = function() {
      maskComponent.applyDatepickerMask();
      maskComponent.applyTimeMask();
      maskComponent.applyNumberMask();
      maskComponent.applyCurrencyMask();
      datepickerComponent.applyDatepicker();

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
          return bridge.get("/api/atendimentos/get/" + params.id).then(function(response) {
            if(!response)
              return;

            self.editSemaphore = true;
            self.cliente(response.atendimento.clienteId);
            self.prestador(response.atendimento.funcionarioId);
            self.data(momentComponent.convertDateToString(response.atendimento.data));
            self.duracao(response.atendimento.duracao);
            self.iniTime(momentComponent.convertTimeToString(response.atendimento.dataInicio));
            return loadServicos().then(function(){
              self.servico(response.atendimento.servicoId);
              self.valorTotal(maskComponent.accountingFormat(response.atendimento.valorTotal));
            });
          });
        }
      })
      .then(function(){
        $('select').material_select();
      })
      .always(function(){
        self.editSemaphore = false;
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
