define(['ko', 'text!qualificacoesProfissionalTemplate', 'bridge', 'maskComponent', 'momentComponent'],
function(ko, template, bridge, maskComponent, momentComponent) {

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
        var estrelas = [];

        for(var cont = 1; cont <= 5; cont++) {
          estrelas.push({
            isGrey : qualificacao.nota >= cont ? false : true
          });
        }

        self.nota += qualificacao.nota;

        return {
          nota      : maskComponent.scoreFormat(qualificacao.nota),
          avaliacao : qualificacao.avaliacao,
          servico   : qualificacao.atendimento.detalhe_servico.servico.nome,
          data      : self.meses[data.getMonth()] + ' de ' + data.getYear(),
          estrelas  : estrelas
        }
      });

      self.qualificacoes(qualificacoes);
    };

    var init = function(){
      bridge.post("/api/qualificacoes/by_profissional", { profissional : localStorage.getItem('current_user_id') })
      .then(function(response) {
        mapResponseToQualificacoes(response.qualificacoes);
      })
      .then(function() {
        self.nota = Math.round(self.nota / self.qualificacoes().length);
        var estrelas = [];

        for(var cont = 1; cont <= 5; cont++) {
          estrelas.push({
            isGrey : self.nota >= cont ? false : true
          });
        }

        self.media(maskComponent.scoreFormat(self.nota));
        self.mediaEstrelas(estrelas);
      });
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "qualificacoesCliente"
    }
  };
});
