var db                    =  require('../../models'),
    especialidadesManager =  require('../../manager/pessoas/prestadores/especialidades/especialidadesManager');

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    return especialidadesManager.findAll(req, res);
  });

  apiRoutes.get(endpoint + '/:id', function(req, res) {
    return especialidadesManager.find(req, res);
  });
  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return especialidadesManager.destroy(req, res);
  });

  apiRoutes.post(endpoint, function(req, res) {
    return especialidadesManager.create(req, res);
  });

  apiRoutes.post(endpoint + '/:id', function(req, res) {
    return especialidadesManager.update(req, res);
  });
}
