var db = require('../../models'),
    controllerHelper = require('../shared/controllerHelper'),
    asd = require('../../models/prestador/prestador');

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    db.prestadores.findAll().then(function(entities) {
      res.statusCode = 200;
      res.json({prestadores: entities})
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.get(endpoint + '/:id', function(req, res) {
    db.prestadores.find({ where: { id: req.param('id') } }).then(function(entity) {
      // console.log(asd);
      // var pedro = Object.create(asd.prestador)
      // console.log(pedro);

      res.statusCode = 200;
      res.json({prestador: entity})
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    db.prestadores.find({ where: { id: req.param('id') } }).then(function(entity) {
      entity.destroy().then(function() {
        res.send(204)
      })
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.post(endpoint, function(req, res) {
    db.prestadores.create(req.body).then(function(entity) {
      res.statusCode = 200;
      res.json(entity)
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });

  apiRoutes.post(endpoint + '/:id', function(req, res) {
    db.prestadores.find({ where: { id: req.param('id') } }).then(function(entity) {
      entity.updateAttributes(req.body).then(function(entity) {
        res.statusCode = 200;
        res.json(entity)
      })
    }).catch(function(errors) {
      return controllerHelper.writeErrors(res, errors);
    });
  });
}
