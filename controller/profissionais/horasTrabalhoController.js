var models           = require('../../models'),
    controllerHelper = require('../shared/controllerHelper');

var sequelize = controllerHelper.createSequelizeInstance();
var self = {};

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    return self.index(req, res);
  });

  apiRoutes.get(endpoint + '/get/:id', function(req, res) {
    return self.get(req, res);
  });

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return self.destroy(req, res);
  });

  apiRoutes.post(endpoint + '/new', function(req, res) {
    return self.create(req, res);
  });

  apiRoutes.post(endpoint + '/edit', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.post(endpoint + '/by_profissional', function(req, res) {
    return self.getByProfissional(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.horas_trabalho.All();

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ horasTrabalho: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.horas_trabalho.Get(req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ horaTrabalho: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.horas_trabalho.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.horas_trabalho.Create(req.body)

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ horaTrabalho: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.horas_trabalho.Update(req.body)

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ horaTrabalho: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByProfissional = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.horas_trabalho.FindByProfissional(models, req.body.profissional)

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ horasTrabalho: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
