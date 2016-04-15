define(['ko', 'text!./servicosTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent'],
function(ko, template, bridge, $, materialize, searchComponent) {

  var viewModel = function(params) {
    var self = this;

    self.servicos = ko.observableArray([]);

    searchComponent.subscribe("/api/servicos/query", function(response){
      mapResponseToServicos(response.servicos);
    });

    self.exclude = function(servico){
      bridge.del("/api/servicos/"+servico.id)
      .then(function(response){
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
