var models           = require('../../models'),
    controllerHelper = require('../shared/controllerHelper');

var sequelize = controllerHelper.createSequelizeInstance();
var self = {};

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    return self.index(req, res);
  });

  apiRoutes.get(endpoint + '/query/:query', function(req, res) {
    return self.index(req, res);
  });

  apiRoutes.get(endpoint + '/get/:id', function(req, res) {
    return self.get(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.servicos.All();

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ servicos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.servicos.Get(req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
