define(['ko', 'text!pesquisaTemplate', 'jquery', 'underscore', 'bridge', 'maskComponent', 'datepickerComponent',
'momentComponent', 'qualificacaoComponent'],
function(ko, template, $, _, bridge, maskComponent, datepickerComponent, momentComponent, qualificacaoComponent) {

  var viewModel = function(params) {
    var self = this;

    self.servico = ko.observable(decodeURIComponent(params.servico != 'undefined' ? params.servico : ''));
    self.cidade = ko.observable(decodeURIComponent(params.cidade != 'undefined' ? params.cidade : ''));
    self.habilidadesSelecionadas = ko.observable();
    self.ramo = ko.observable();
    self.data = ko.observable(decodeURIComponent(params.data != 'undefined' ? params.data : momentComponent.convertDateToString(new Date())));
    self.hora = ko.observable();
    self.hasResult = ko.observable(false);

    self.ramos = ko.observableArray([]);
    self.diasSemana = ko.observableArray([]);
    self.habilidades = ko.observableArray([]);
    self.profissionais = ko.observableArray([]);

    self.loadHabilidades = ko.computed(function(){
      self.habilidadesSelecionadas(undefined);
      if (!!self.ramo()) {
        bridge.get("/api/especialidades/seeded_by_ramo/"+self.ramo())
        .then(function(response){
          mapResponseToHabilidades(response.especialidades);
        });
      } else {
        self.habilidades([]);
        $('select').material_select();
      }
    });

    self.pesquisa = function(){
      findProfissionais();
    };

    self.visualizar = function(profissional){
      return window.location.hash = '#atendimentos/new/profissional=' + profissional.id + '&data=' + encodeURIComponent(self.data());
    };

    var generatePayload = function(){
      var payload = {
        servico     : self.servico(),
        cidade      : self.cidade(),
        habilidades : JSON.stringify(self.habilidadesSelecionadas()),
        ramo        : self.ramo(),
        data        : returnData(),
        hora        : self.hora(),
        diaSemana   : momentComponent.returnDateWeekday(returnData())
      };

      return payload;
    };

    var mapResponseToHabilidades = function(habilidades){
      if(!habilidades.length) {
        self.habilidades([]);
        $('select').material_select();

        return;
      }

      var habilidades = habilidades.map(function(habilidade){
        return {
          id       : habilidade.id,
          text     : habilidade.nome
        }
      });

      self.habilidades(habilidades);
      $('select').material_select();
    };

    var mapResponseToProfissionais = function(profissionais){
      if(!profissionais.length) {
        self.hasResult(true);
        return self.profissionais([]);
      }

      self.hasResult(false);
      var profissionais = profissionais.filter(function(profissional){
        var dataHora = momentComponent.convertStringToDateTime(returnData(), self.hora());
        if (!!self.hora()) {
          var atendimento = _.find(profissional.atendimentos, function(atendimento){
            var dataInicio = momentComponent.convertDateStringToDate(atendimento.dataInicio);
            var dataFim = momentComponent.convertDateStringToDate(atendimento.dataFim);
            return dataInicio <= dataHora && dataFim >= dataHora;
          });

          if (atendimento) return false;
        }
        return true;
      }).map(function(profissional){
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });
        var diaSemanaId = momentComponent.returnDateWeekday(returnData());
        var diaSemana = _.find(self.diasSemana(), function(currentDiaSemana){ return currentDiaSemana.id == diaSemanaId; });

        return {
          id        : profissional.id,
          nome      : profissional.nome,
          ramo      : ramo.text,
          data      : returnData().substring(0, 5),
          diaSemana : diaSemana.text.substring(0, 3),
          estrelas  : qualificacaoComponent.buildStarsArray(profissional.mediaNota)
        }
      });

      self.profissionais(profissionais);
    };

    var returnData = function() {
      return self.data() ? self.data() : momentComponent.convertDateToString(new Date());
    };

    var findProfissionais = function() {
      bridge.post("/api/profissionais/search", generatePayload())
      .then(function(response){
        mapResponseToProfissionais(response.profissionais);
      });
    };

    var init = function(){
      datepickerComponent.applyDatepickerForFuture();

      maskComponent.applyTimeMask();

      bridge.get("/api/profissionais/pesquisa/form_options")
      .then(function(response){
        var ramos = response.ramos.map(function(ramo){
          return {
            id   : ramo.id,
            text : ramo.text
          }
        });

        self.ramos(ramos);

        var diasSemana = response.diasSemana.map(function(diaSemana){
          return {
            id   : diaSemana.id,
            text : diaSemana.text
          }
        });

        self.diasSemana(diasSemana);
      })
      .then(function(){
        $('select').material_select();
      })
      .then(function() {
        findProfissionais();
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Pesquisa"
    }
  };
});
