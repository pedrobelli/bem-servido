var clientesManager = require('../../manager/clientes/clientesManager');

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    return clientesManager.findAll(req, res);
  });

  apiRoutes.get(endpoint + '/:id', function(req, res) {
    return clientesManager.find(req, res);
  });

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return clientesManager.destroy(req, res);
  });

  apiRoutes.post(endpoint, function(req, res) {
    return clientesManager.create(req, res);
  });

  apiRoutes.post(endpoint + '/:id', function(req, res) {
    return clientesManager.update(req, res);
  });
}
