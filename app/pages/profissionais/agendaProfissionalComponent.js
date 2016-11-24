define(['ko', 'text!agendaProfissionalTemplate', 'bridge', 'momentComponent', 'agendaComponent', 'datepickerComponent'],
function(ko, template, bridge, momentComponent, agendaComponent, datepickerComponent) {

  var viewModel = function(params) {
    var self = this;

    self.data = ko.observable(momentComponent.convertDateToString(new Date()));

    self.horasTrabalho = ko.observableArray([]);
    self.atendimentos = ko.observableArray([]);

    self.pageLoadSemaphore = false;

    self.loadProfissionalInfo = ko.computed(function(){
      if ((!!self.data() || !self.data()) && self.pageLoadSemaphore) {
        findProfissional();
      }
    });

    var generatePayload = function(){
      var payload = {
        id        : localStorage.getItem('current_user_id'),
        data      : self.data(),
        diaSemana : momentComponent.returnDateWeekday(returnData())
      };

      return payload;
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var findProfissional = function() {
      return bridge.post("/api/profissionais/by_date_weekday", generatePayload())
      .then(function(response) {
        self.horasTrabalho(agendaComponent.mapResponseToHoraDeTrabalho(response.profissional.horas_trabalhos[0]));
        self.atendimentos(agendaComponent.mapResponseToAtendimentos(response.profissional.atendimentos, self.horasTrabalho()));
      });
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

      findProfissional() .then(function() {
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
