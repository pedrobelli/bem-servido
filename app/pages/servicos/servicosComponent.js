define(['ko', 'text!./servicosTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent', '../shared/swal/swalComponent',
'../shared/mask/maskComponent'],
function(ko, template, bridge, $, materialize, searchComponent, swalComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.detalheServicos = ko.observableArray([]);

    searchComponent.subscribe("/api/detalhe_servicos/query", function(response){
      mapResponseToServicos(response.detalheServicos);
    });

    self.exclude = function(detalheServico){
      var errorTitle = 'Não foi possível excluir serviço';
      swalComponent.removeInstanceWarning("/api/detalhe_servicos/" + detalheServico.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToServicos = function(detalheServicos){
      if(!detalheServicos) return self.detalheServicos([]);
      var detalheServicos = detalheServicos.map(function(detalheServico){
        return {
          id     : detalheServico.id,
          nome   : detalheServico.servico.nome,
          valor  : maskComponent.accountingFormat(detalheServico.valor)
        };
      });

      self.detalheServicos(detalheServicos);
    };

    var init = function(){
      bridge.get("/api/detalhe_servicos")
      .then(function(response){
        mapResponseToServicos(response.detalheServicos);
        searchComponent.setPlaceholderText(response.placeholderOptions);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Serviços"
    }
  };
});
