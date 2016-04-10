var db               = require('../../models'),
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

  apiRoutes.post(endpoint + '/edit/:id', function(req, res) {
    return self.update(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.clientes.All(t);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ clientes: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.clientes.Get(t, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.clientes.Destroy(t, req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.clientes.Create(t, req);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.clientes.Update(t, req);

  }).then(function(entity) {
    console.log(entity);
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
