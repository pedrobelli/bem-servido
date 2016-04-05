var db = require('../../models'),
    controllerHelper = require('../shared/controllerHelper');

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    db.clientes.findAll().then(function(entities) {
      res.statusCode = 200;
      res.json({clientes: entities})
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.get(endpoint + '/:id', function(req, res) {
    db.clientes.find({ where: { id: req.param('id') } }).then(function(entity) {
      res.statusCode = 200;
      res.json({cliente: entity})
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    db.clientes.find({ where: { id: req.param('id') } }).then(function(entity) {
      entity.destroy().then(function() {
        res.send(204)
      })
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.post(endpoint, function(req, res) {
    db.clientes.create(req.body).then(function(entity) {
      res.statusCode = 200;
      res.json(entity)
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.post(endpoint + '/:id', function(req, res) {
    db.clientes.find({ where: { id: req.param('id') } }).then(function(entity) {
      entity.updateAttributes(req.body).then(function(entity) {
        res.statusCode = 200;
        res.json(entity)
      })
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });
}
