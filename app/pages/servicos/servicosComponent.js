define(['ko', 'text!./servicosTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent', '../shared/swal/swalComponent'],
function(ko, template, bridge, $, materialize, searchComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.servicos = ko.observableArray([]);

    searchComponent.subscribe("/api/servicos/query", function(response){
      mapResponseToServicos(response.servicos);
    });

    self.exclude = function(servico){
      var errorTitle = 'Não foi possível excluir serviço';
      swalComponent.removeInstanceWarning("/api/servicos/" + servico.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToServicos = function(servicos){
      if(!servicos) return self.servicos([]);
      var servicos = servicos.map(function(servico){
        return {
          id        : servico.id,
          descricao : servico.descricao,
          valor     : servico.valor
        };
      });

      self.servicos(servicos);
    };

    var init = function(){
      bridge.get("/api/servicos")
      .then(function(response){
        mapResponseToServicos(response.servicos);
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
