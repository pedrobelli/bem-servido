define(['ko', 'text!qualificacoesProfissionalPartialTemplate', 'bridge', 'maskComponent', 'momentComponent',
'qualificacaoComponent'],
function(ko, template, bridge, maskComponent, momentComponent, qualificacaoComponent) {

  var viewModel = function(params) {
    var self = this;

    self.nota = 0;

    self.qualificacoes = ko.observableArray([]);
    self.media = ko.observableArray([]);
    self.mediaEstrelas = ko.observableArray([]);

    self.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    var mapResponseToQualificacoes = function(qualificacoes){
      if(!qualificacoes.length) return self.qualificacoes([]);

      var qualificacoes = qualificacoes.map(function(qualificacao){
        var data = momentComponent.convertDateStringToDate(qualificacao.atendimento.dataInicio);

        return {
          nota      : maskComponent.scoreFormat(qualificacao.nota),
          avaliacao : qualificacao.avaliacao,
          servico   : qualificacao.atendimento.detalhe_servico.servico.nome,
          data      : self.meses[data.getMonth()] + ' de ' + data.getYear(),
          estrelas  : qualificacaoComponent.buildStarsArray(qualificacao.nota)
        }
      });

      self.qualificacoes(qualificacoes);
    };

    self.subscribe = function(profissionalId) {
      bridge.post("/api/qualificacoes/by_profissional", { profissional : profissionalId })
      .then(function(response) {
        mapResponseToQualificacoes(response.qualificacoes);
      })
      .then(function() {
        return bridge.get("/api/profissionais/get_score/" + profissionalId)
        .then(function(response){
          self.media(maskComponent.scoreFormat(!!response.profissional.mediaNota ? response.profissional.mediaNota : 0));
          self.mediaEstrelas(qualificacaoComponent.buildStarsArray(response.profissional.mediaNota));
        });
      });
    }
  };

  var instance = new viewModel();

  ko.components.register('profissional-qualificacao-partial', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
