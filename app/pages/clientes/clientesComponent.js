define(['ko', 'text!clientesTemplate', 'bridge', 'jquery', 'materialize', 'swalComponent'],
function(ko, template, bridge, $, materialize, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.clientes = ko.observableArray([]);

    self.exclude = function(cliente){
      var errorTitle = 'Não foi possível excluir cliente';
      swalComponent.removeInstanceWarning("/api/clientes/" + cliente.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToClientes = function(clientes){
      if(!clientes) return self.clientes([]);
      var clientes = clientes.map(function(cliente){
        return {
          id    : cliente.id,
          nome  : cliente.nome,
          email : cliente.email
        };
      });

      self.clientes(clientes);
    };

    var init = function(){
      bridge.get("/api/clientes")
      .then(function(response){
        mapResponseToClientes(response.clientes);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Clientes"
    }
  };
});
