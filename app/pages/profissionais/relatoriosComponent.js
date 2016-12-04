define(['ko', 'text!relatoriosTemplate', 'bridge', 'jquery', 'swalComponent', 'momentComponent', 'datepickerComponent'],
function(ko, template, bridge, $, swalComponent, momentComponent, datepickerComponent) {

  var viewModel = function(params) {
    var self = this;

    var FIRST_OPTION_URL = '/api/agendamentos/by_ano';
    var SECOND_OPTION_URL = '/api/agendamentos/by_date_interval';
    var THIRD_OPTION_URL = '/api/agendamentos/by_date_interval/filter_by_year';

    self.opcao = ko.observable();
    self.ano = ko.observable();
    self.dataInicio = ko.observable();
    self.dataFim = ko.observable();
    self.hasResult = ko.observable(false);
    self.filterByYear = false;

    self.opcoes = ko.observableArray([]);
    self.anos = ko.observableArray([]);
    self.firstOptionAgendamentos = ko.observableArray([]);
    self.secondOptionAgendamentos = ko.observableArray([]);
    self.thirdOptionAgendamentos = ko.observableArray([]);
    self.headerOptions = ko.observableArray([]);

    self.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    self.firstHeaderOptions = [
      { text: '#' },
      { text: 'Mês' },
      { text: 'Qualificados' },
      { text: 'Bloqueados' },
      { text: 'Total' }
    ];

    self.secondHeaderOptions = [
      { text: '#' },
      { text: 'Data' },
      { text: 'Horário Inicial' },
      { text: 'Horário Final' },
      { text: 'Qualificado' },
      { text: 'Bloqueado' },
    ];

    self.thirdHeaderOptions = [
      { text: '#' },
      { text: 'Mês' },
      { text: 'Ano' },
      { text: 'Qualificados' },
      { text: 'Bloqueados' },
      { text: 'Total' }
    ];

    self.anoOptions = [
      { text: '2016' },
      { text: '2017' },
      { text: '2018' },
      { text: '2019' },
      { text: '2020' },
      { text: '2021' },
      { text: '2022' },
      { text: '2023' },
      { text: '2024' },
      { text: '2025' }
    ];

    self.loadAgendamentosForm = ko.computed(function(){
      if (!!self.opcao()) {
        if (self.opcao() == 1) {
          self.anos(self.anoOptions);
          $('.second-option').fadeOut();
          $('.first-option').fadeIn();
          $('#filter-by-year').removeClass('material-checkbox');

          self.dataInicio(undefined);
          self.dataFim(undefined);
          self.filterByYear = false;
        } else if (self.opcao() == 2) {
          $('.first-option').fadeOut();
          $('.second-option').fadeIn();

          self.ano(undefined);
        }
        $('select').material_select();
        datepickerComponent.applyDatepicker();

      }
      self.headerOptions([]);
      self.firstOptionAgendamentos([]);
      self.secondOptionAgendamentos([]);
      self.thirdOptionAgendamentos([]);
    });

    self.gerar = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      var url = self.opcao() == 1 ? FIRST_OPTION_URL : (!self.filterByYear ? SECOND_OPTION_URL : THIRD_OPTION_URL);

      bridge.post(url, generatePayload())
      .then(function(response) {
        mapResponseToAgendamentos(response.agendamentos);
      });
    };

    self.check = function(){
      if (self.filterByYear) {
        $('#filter-by-year').removeClass('material-checkbox');
        self.filterByYear = false;
      } else {
        $('#filter-by-year').addClass('material-checkbox');
        self.filterByYear = true;
      }
    };

    var generatePayload = function(){
      var payload = {};

      if (self.opcao() == 1) {
        payload.ano = self.ano();
      } else if (self.opcao() == 2) {
        payload.dataInicio = momentComponent.convertStringToDateFirstSecond(self.dataInicio());
        payload.dataFim = momentComponent.convertStringToDateLastSecond(self.dataFim());
      }

      return payload;
    };

    var mapResponseToAgendamentos = function(agendamentos){
      if(!agendamentos.length) {
        self.hasResult(true);
        return self.firstOptionAgendamentos([]);
      }

      self.hasResult(false);
      var cont = 0;
      if (self.opcao() == 1) {
        var agendamentos = agendamentos.map(function(agendamento){
          return {
            cont         : ++cont,
            mes          : self.meses[agendamento.mes - 1],
            qualificados : !!agendamento.qualificados ? agendamento.qualificados : 0,
            bloqueados   : !!agendamento.bloqueados ? agendamento.bloqueados : 0,
            total        : !!agendamento.totalAgendamentos ? agendamento.totalAgendamentos : 0
          }
        });

        self.headerOptions(self.firstHeaderOptions);
        self.firstOptionAgendamentos(agendamentos);
      } else if (self.opcao() == 2) {
        self.secondOptionAgendamentos([]);
        self.thirdOptionAgendamentos([]);

        if (!self.filterByYear) {
          var agendamentos = agendamentos.map(function(agendamento){
            return {
              cont          : ++cont,
              data          : momentComponent.convertDateToString(agendamento.dataInicio),
              horarioInicio : momentComponent.convertTimeToString(agendamento.dataInicio),
              horarioFim    : momentComponent.convertTimeToString(agendamento.dataFim),
              qualificado   : !!agendamento.qualificado ? 'Sim' : 'Não',
              bloqueado     : !!agendamento.bloqueado ? 'Sim' : 'Não'
            }
          });

          self.headerOptions(self.secondHeaderOptions);
          self.secondOptionAgendamentos(agendamentos);
        } else {
          var agendamentos = agendamentos.map(function(agendamento){
            return {
              cont          : ++cont,
              mes          : self.meses[agendamento.mes - 1],
              ano          : agendamento.ano,
              qualificados : !!agendamento.qualificados ? agendamento.qualificados : 0,
              bloqueados   : !!agendamento.bloqueados ? agendamento.bloqueados : 0,
              total        : !!agendamento.totalAgendamentos ? agendamento.totalAgendamentos : 0
            }
          });

          self.headerOptions(self.thirdHeaderOptions);
          self.thirdOptionAgendamentos(agendamentos);
        }
      }
    };

    var validate = function(){
      var errors = []
      valid = !!self.opcao();

      if (!!self.opcao() && self.opcao() == 1) {
        valid = valid && !!self.ano();
      }

      if (!!self.opcao() && self.opcao() == 2) {
        valid = valid && !!self.dataInicio();
        valid = valid && !!self.dataFim();
      }

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar seu cadastro.");
      }

      return errors;
    };

    var init = function(){
      $('select').material_select();
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Relatórios"
    }
  };
});
