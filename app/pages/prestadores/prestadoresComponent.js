define(['ko', 'text!./prestadoresTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent'],
function(ko, template, bridge, $, materialize, searchComponent) {

  var viewModel = function(params) {
    var self = this;

    self.prestadores = ko.observableArray([]);

    searchComponent.subscribe("/api/prestadores/query", function(response){
      mapResponseToPrestadores(response.prestadores);
    });

    self.exclude = function(prestador){
      bridge.del("/api/prestadores/" + prestador.id)
      .then(function(response){
        init();
      });
    };

    var mapResponseToPrestadores = function(prestadores){
      if(!prestadores) return self.prestadores([]);
      var prestadores = prestadores.map(function(prestador){
        return {
          id    : prestador.id,
          nome  : prestador.nome,
          email : prestador.email
        };
      });

      self.prestadores(prestadores);
    };

    var init = function(){
      bridge.get("/api/prestadores")
      .then(function(response){
        mapResponseToPrestadores(response.prestadores);
        searchComponent.setPlaceholderText(response.placeholderOptions);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Prestadores"
    }
  };
});
