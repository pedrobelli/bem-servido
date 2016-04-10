define(['ko', 'text!./clientesTemplate.html', 'bridge', 'jquery', 'materialize'],
function(ko, template, bridge, $, materialize) {

  var viewModel = function(params) {
    var self = this;

    self.clientes = ko.observableArray([]);

    self.exclude = function(cliente){
      bridge.del("/api/clientes/"+cliente.id)
      .then(function(response){
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
