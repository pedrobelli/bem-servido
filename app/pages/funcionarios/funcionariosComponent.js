define(['ko', 'text!./funcionariosTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent', '../shared/swal/swalComponent'],
function(ko, template, bridge, $, materialize, searchComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.funcionarios = ko.observableArray([]);

    searchComponent.subscribe("/api/funcionarios/query", function(response){
      mapResponseToFuncionarios(response.funcionarios);
    });

    self.exclude = function(funcionario){
      var errorTitle = 'Não foi possível excluir funcionário';
      swalComponent.removeInstanceWarning("/api/funcionarios/" + funcionario.id, errorTitle, function(){
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
