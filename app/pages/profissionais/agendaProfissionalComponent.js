define(['ko', 'text!agendaProfissionalTemplate', 'bridge', 'momentComponent', 'agendaComponent', 'datepickerComponent',
'profissionalAgendamentoModalComponent', 'maskComponent', 'detalheAgendamentoModalComponent', 'bloqueioAgendamentoModalComponent'],
function(ko, template, bridge, momentComponent, agendaComponent, datepickerComponent, profissionalAgendamentoModalComponent,
maskComponent, detalheAgendamentoModalComponent, bloqueioAgendamentoModalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.data = ko.observable(momentComponent.convertDateToString(new Date()));

    self.horasTrabalho = ko.observableArray([]);
    self.agendamentos = ko.observableArray([]);
    self.hasResult = ko.observable(false);

    self.pageLoadSemaphore = false;

    detalheAgendamentoModalComponent.subscribe();
    bloqueioAgendamentoModalComponent.subscribe();

    self.loadProfissionalInfo = ko.computed(function(){
      if ((!!self.data() || !self.data()) && self.pageLoadSemaphore) {
        findProfissional();
      }
    });

    self.agendar = function(){
      if (!!localStorage.getItem('current_user_role') && parseInt(localStorage.getItem('current_user_role')) == 1) {
        swalComponent.customWarningActionWithTitle("Atenção", "É necessário estar loggado com um profissional para realizar um agendamento!", function(){});
      } else if (!localStorage.getItem('current_user_id')) {
        swalComponent.customWarningActionWithTitle("Atenção", "É necessário estar loggado para realizar um agendamento!", function(){
					return window.location.hash = '#login';
				});
      } else {
        var dto = {
          profissional : localStorage.getItem('current_user_id'),
          data         : self.data()
        }
        profissionalAgendamentoModalComponent.showAgendamentosModal(dto, function() {
          findProfissional();
        });
      }
    };

    self.bloquear = function(){
      if (!!localStorage.getItem('current_user_role') && parseInt(localStorage.getItem('current_user_role')) == 1) {
        swalComponent.customWarningActionWithTitle("Atenção", "É necessário estar loggado com um profissional para realizar um agendamento!", function(){});
      } else if (!localStorage.getItem('current_user_id')) {
        swalComponent.customWarningActionWithTitle("Atenção", "É necessário estar loggado para realizar um agendamento!", function(){
					return window.location.hash = '#login';
				});
      } else {
        bloqueioAgendamentoModalComponent.showBloqueioModal(localStorage.getItem('current_user_id'), function() {
          findProfissional();
        });
      }
    };

    self.mostrarDetalhes = function(agendamento){
      detalheAgendamentoModalComponent.showDetalhesAgendamentoModal(agendamento.id, function() {
        findProfissional();
      });
    };

    var generatePayload = function(){
      var payload = {
        id        : localStorage.getItem('current_user_id'),
        data      : self.data(),
        diaSemana : momentComponent.returnDateWeekday(returnData())
      };

      return payload;
    };

    var mapResponseToDetalheServicos = function(detalheServicos){
      if(!detalheServicos.length) return;

      var detalheServicos = detalheServicos.map(function(detalheServico){
        return {
          id      : detalheServico.id,
          text    : detalheServico.servico.nome,
          valor   : maskComponent.accountingFormat(detalheServico.valor),
          duracao : detalheServico.duracao
        }
      });

      profissionalAgendamentoModalComponent.subscribe(detalheServicos);
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var findProfissional = function() {
      return bridge.post("/api/profissionais/by_date_weekday", generatePayload())
      .then(function(response) {
        mapResponseToDetalheServicos(response.profissional.detalhe_servicos);
        self.horasTrabalho(agendaComponent.mapResponseToHoraDeTrabalho(response.profissional.horas_trabalhos[0]));
        self.agendamentos(agendaComponent.mapResponseToAgendamentos(response.profissional.agendamentos, self.horasTrabalho()));

        if (!response.profissional.horas_trabalhos.length) {
          self.hasResult(true);
        } else if (!!response.profissional.horas_trabalhos.length && self.hasResult()) {
          self.hasResult(false);
        }
      });
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

      findProfissional().then(function() {
        self.pageLoadSemaphore = true;
      });
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Agenda do profissional"
    }
  };
});
