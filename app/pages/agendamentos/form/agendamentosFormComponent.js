define(['ko', 'text!agendamentosFormTemplate', 'jquery', 'underscore', 'bridge', 'maskComponent', 'datepickerComponent',
'momentComponent', 'agendamentoModalComponent', 'swalComponent', 'agendaComponent', 'qualificacaoComponent'],
function(ko, template, $, _, bridge, maskComponent, datepickerComponent, momentComponent, agendamentoModalComponent,
swalComponent, agendaComponent, qualificacaoComponent) {

  var viewModel = function(params) {
    var self = this;

    self.profissional = ko.observable(params.profissional != 'undefined' ? params.profissional : '');
    self.data = ko.observable(decodeURIComponent(params.data != 'undefined' ? params.data : momentComponent.convertDateToString(new Date())));
    self.nome = ko.observable();
    self.ramo = ko.observable();
    self.telefone = ko.observable();
    self.celular = ko.observable();
    self.endereco = ko.observable();
    self.hasHorarioResult = ko.observable(false);
    self.hasServicoResult = ko.observable(false);

    self.ramos = ko.observableArray([]);
    self.detalheServicos = ko.observableArray([]);
    self.horasTrabalho = ko.observableArray([]);
    self.agendamentos = ko.observableArray([]);
    self.estados = ko.observableArray([]);
    self.mediaEstrelas = ko.observableArray([]);

    self.pageLoadSemaphore = false;

    self.loadProfissionalInfo = ko.computed(function(){
      if ((!!self.data() || !self.data()) && self.pageLoadSemaphore) {
        loadProfissionalInfo();
      }
    });

    self.agendar = function(profissional){
      if (!!localStorage.getItem('current_user_role') && parseInt(localStorage.getItem('current_user_role')) == 2) {
        swalComponent.customWarningActionWithTitle("Atenção", "É necessário estar loggado com um cliente para realizar um agendamento!", function(){});
      } else if (!localStorage.getItem('current_user_id')) {
        swalComponent.customWarningActionWithTitle("Atenção", "É necessário estar loggado para realizar um agendamento!", function(){
					return window.location.hash = '#login';
				});
      } else {
        var dto = {
          profissional : self.profissional(),
          cliente      : localStorage.getItem('current_user_id'),
          data         : self.data()
        }
        agendamentoModalComponent.showAgendamentosModal(dto);
      }
    };

    var generatePayload = function(){
      var payload = {
        id        : self.profissional(),
        data      : self.data(),
        diaSemana : momentComponent.returnDateWeekday(returnData())
      };

      return payload;
    };

    var mapResponseToDetalheServicos = function(detalheServicos){
      if(!detalheServicos.length) return self.detalheServicos([]);

      var detalheServicos = detalheServicos.map(function(detalheServico){
        return {
          id      : detalheServico.id,
          text    : detalheServico.servico.nome,
          valor   : maskComponent.accountingFormat(detalheServico.valor),
          duracao : detalheServico.duracao
        }
      });

      self.detalheServicos(detalheServicos);
      agendamentoModalComponent.subscribe(self.detalheServicos());
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var loadProfissionalInfo = function() {
      return bridge.post("/api/profissionais/by_date_weekday", generatePayload())
      .then(function(response) {
        var profissional = response.profissional;
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });
        var estado = _.find(self.estados(), function(estado){ return estado.id == profissional.endereco.estado; });
        var telefone = profissional.telefone.telefone;
        var celular = profissional.telefone.celular;
        self.nome(profissional.nome);
        self.ramo(ramo.text);
        self.endereco(maskComponent.addressFormat(profissional.endereco, estado));
        self.telefone(telefone);
        self.celular(celular);

        mapResponseToDetalheServicos(profissional.detalhe_servicos);
        self.horasTrabalho(agendaComponent.mapResponseToHoraDeTrabalho(profissional.horas_trabalhos[0]));
        self.agendamentos(agendaComponent.mapResponseToAgendamentos(profissional.agendamentos, self.horasTrabalho()));

        if (!profissional.horas_trabalhos.length) {
          self.hasHorarioResult(true);
        } else if (!!profissional.horas_trabalhos.length && self.hasHorarioResult()) {
          self.hasHorarioResult(false);
        }

        if (!profissional.detalhe_servicos.length) {
          self.hasServicoResult(true);
        } else if (!!profissional.detalhe_servicos.length && self.hasServicoResult()) {
          self.hasServicoResult(false);
        }
      });
    };

    var init = function(){
      datepickerComponent.applyDatepickerForFuture();

      bridge.get("/api/profissionais/pesquisa/form_options")
      .then(function(response){
        var ramos = response.ramos.map(function(ramo){
          return {
            id   : ramo.id,
            text : ramo.text
          }
        });

        self.ramos(ramos);

        var estados = response.estados.map(function(estado){
          return {
            id    : estado.id,
            text  : estado.text,
            sigla : estado.sigla
          }
        });

        self.estados(estados);
      })
      .then(function() {
        return loadProfissionalInfo();
      })
      .then(function() {
        return bridge.get("/api/profissionais/get_score/" + self.profissional())
        .then(function(response){
          self.mediaEstrelas(qualificacaoComponent.buildStarsArray(response.profissional.mediaNota));
        });
      })
      .then(function() {
        maskComponent.applyCelphoneMask();
        self.pageLoadSemaphore = true;
        $('select').material_select();
        $('.collapsible').collapsible();
      });
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Agenda de Profissional"
    }
  };
});
