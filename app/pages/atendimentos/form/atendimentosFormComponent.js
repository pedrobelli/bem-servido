define(['ko', 'text!atendimentosFormTemplate', 'jquery', 'underscore', 'bridge', 'maskComponent', 'datepickerComponent',
'momentComponent', 'atendimentoModalComponent', 'swalComponent', 'agendaComponent'],
function(ko, template, $, _, bridge, maskComponent, datepickerComponent, momentComponent, atendimentoModalComponent,
swalComponent, agendaComponent) {

  var viewModel = function(params) {
    var self = this;

    self.profissional = ko.observable(params.profissional != 'undefined' ? params.profissional : '');
    self.data = ko.observable(decodeURIComponent(params.data != 'undefined' ? params.data : momentComponent.convertDateToString(new Date())));
    self.nome = ko.observable();
    self.ramo = ko.observable();

    self.ramos = ko.observableArray([]);
    self.detalheServicos = ko.observableArray([]);
    self.horasTrabalho = ko.observableArray([]);
    self.atendimentos = ko.observableArray([]);

    self.pageLoadSemaphore = false;

    self.loadProfissionalInfo = ko.computed(function(){
      if ((!!self.data() || !self.data()) && self.pageLoadSemaphore) {
        loadProfissionalInfo();
      }
    });

    self.agendar = function(profissional){
      if (!!localStorage.getItem('current_user_role') && parseInt(localStorage.getItem('current_user_role')) == 2) {
        swalComponent.customWarningAction("Atenção", "É necessário estar loggado com um cliente para realizar um agendamento!", function(){});
      } else if (!localStorage.getItem('current_user_id')) {
        swalComponent.customWarningAction("Atenção", "É necessário estar loggado para realizar um agendamento!", function(){
					return window.location.hash = '#login';
				});
      } else {
        var dto = {
          profissional : self.profissional(),
          cliente      : localStorage.getItem('current_user_id'),
          data         : self.data()
        }
        atendimentoModalComponent.showAtendimentosModal(dto);
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
      atendimentoModalComponent.subscribe(self.detalheServicos());
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var loadProfissionalInfo = function() {
      bridge.post("/api/profissionais/by_date_weekday", generatePayload())
      .then(function(response) {
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == response.profissional.ramo; });
        self.nome(response.profissional.nome);
        self.ramo(ramo.text);

        mapResponseToDetalheServicos(response.profissional.detalhe_servicos);
        self.horasTrabalho(agendaComponent.mapResponseToHoraDeTrabalho(response.profissional.horas_trabalhos[0]));
        self.atendimentos(agendaComponent.mapResponseToAtendimentos(response.profissional.atendimentos, self.horasTrabalho()));
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
      })
      .then(function() {
        loadProfissionalInfo();
      })
      .then(function() {
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
