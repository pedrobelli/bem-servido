var models           = require('../../models'),
    enums            = require('../shared/enums'),
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

  apiRoutes.post(endpoint + '/by_clientes', function(req, res) {
    return self.getByClientes(req, res);
  });

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
    return self.formOptions(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.atendimentos.All(models);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ atendimentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.atendimentos.Get(req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ atendimento: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.atendimentos.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.atendimentos.Create(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ atendimento: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.atendimentos.Update(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ atendimento: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByClientes = function(req, res) {
  return sequelize.transaction(function(t) {
    scopes = [];

    if (!!req.body.servico) {
      scopes.push({ method: ['byServiceName', models, req.body.servico] });
    } else {
      scopes.push({ method: ['noServiceName', models, req.body.servico] });
    }

    return models.atendimentos.getByClientes(models, scopes, req.body.data, req.body.cliente);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ atendimentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  options.ramos = enums.ramos;
  options.diasSemana = enums.diasSemana;
  options.estados = enums.estados;

  res.statusCode = 200;
  res.json(options);
}
