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

  apiRoutes.post(endpoint + '/by_servicos', function(req, res) {
    return self.getByServicos(req, res);
  });

  apiRoutes.get(endpoint + '/seeded_by_ramo/:ramo_id', function(req, res) {
    return self.getSeededByRamo(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.All();

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ enderecos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.Get(req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ endereco: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.Create(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ endereco: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.Update(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ endereco: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByServicos = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.FindByServicos(models, req.param('servicos'))

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ enderecos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getSeededByRamo = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.enderecos.FindSeededByRamo(models, req.param('ramo_id'))

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ enderecos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
