define(['ko', 'text!./funcionariosTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent'],
function(ko, template, bridge, $, materialize, searchComponent) {

  var viewModel = function(params) {
    var self = this;

    self.funcionarios = ko.observableArray([]);

    searchComponent.subscribe("/api/funcionarios/query", function(response){
      mapResponseToFuncionarios(response.funcionarios);
    });

    self.exclude = function(funcionario){
      bridge.del("/api/funcionarios/" + funcionario.id)
      .then(function(response){
        init();
      });
    };

    var mapResponseToFuncionarios = function(funcionarios){
      if(!funcionarios) return self.funcionarios([]);
      var funcionarios = funcionarios.map(function(funcionario){
        return {
          id    : funcionario.id,
          nome  : funcionario.nome,
          email : funcionario.email
        };
      });

      self.funcionarios(funcionarios);
    };

    var init = function(){
      bridge.get("/api/funcionarios")
      .then(function(response){
        mapResponseToFuncionarios(response.funcionarios);
        searchComponent.setPlaceholderText(response.placeholderOptions);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Funcionarios"
    }
  };
});
