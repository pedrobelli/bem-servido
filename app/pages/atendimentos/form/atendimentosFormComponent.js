define(['ko', 'text!atendimentosFormTemplate', 'jquery', 'underscore', 'bridge', 'maskComponent', 'datepickerComponent',
'momentComponent', 'atendimentoModalComponent', 'swalComponent'],
function(ko, template, $, _, bridge, maskComponent, datepickerComponent, momentComponent, atendimentoModalComponent,
swalComponent) {

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

    var mapResponseToHoraDeTrabalho = function(horaTrabalho){
      if(!horaTrabalho) return self.horasTrabalho([]);

      profissionalHorasTrabalho = [];
      var horaAtual = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(horaTrabalho.horaInicio));
      var horaFim = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(horaTrabalho.horaFim));

      for ( ; horaFim.diff(horaAtual, 'minutes') >= 0; ) {
        payload = {};
        var inicioRoundUp = momentComponent.roundUp(momentComponent.convertTimeToStringNoOffset(horaAtual));

        if (horaFim .diff(horaAtual, 'minutes') == 0) {
          payload.hora = momentComponent.convertTimeToStringNoOffset(horaFim.toDate());
          payload.height = 0;
          horaAtual.add(30, 'minutes')
        } else if (horaFim.diff(inicioRoundUp, 'minutes') >= 0) {
          payload = generateHoraTrabalho(horaAtual, inicioRoundUp.diff(horaAtual, 'minutes'));
          horaAtual.add(payload.height, 'minutes')
        } else {
          payload = generateHoraTrabalho(horaAtual, horaFim.diff(horaAtual, 'minutes'));
          horaAtual.add(payload.height, 'minutes')
        }

        profissionalHorasTrabalho.push(payload);
      }

      self.horasTrabalho(profissionalHorasTrabalho);
    };

    var mapResponseToAtendimentos = function(atendimentos){
      if(!atendimentos.length || !self.horasTrabalho().length) return self.atendimentos([]);

      var horaTrabalhoInicial = momentComponent.convertTimeStringToMoment(self.horasTrabalho()[0].hora)
      var atendimentos = atendimentos.map(function(atendimento){
        var horaAtual = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(atendimento.dataInicio));
        return {
          top    : (horaAtual.diff(horaTrabalhoInicial, 'minutes')),
          height : atendimento.duracao
        }
      });

      self.atendimentos(atendimentos);
    };

    var generateHoraTrabalho = function(horaAtual, diferenca) {
      payload.hora = momentComponent.convertTimeToStringNoOffset(horaAtual.toDate());
      if (diferenca <= 30) {
        payload.height = diferenca;
      } else {
        diferenca = diferenca - 30
        payload.height = diferenca;
      }
      return payload;
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
        mapResponseToHoraDeTrabalho(response.profissional.horas_trabalhos[0]);
        mapResponseToAtendimentos(response.profissional.atendimentos);
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
