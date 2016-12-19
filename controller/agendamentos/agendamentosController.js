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

  apiRoutes.get(endpoint + '/not_qualified_by_clientes/:id', function(req, res) {
    return self.getNotQualifiedByClientes(req, res);
  });

  apiRoutes.post(endpoint + '/by_ano', function(req, res) {
    return self.getByAno(req, res);
  });

  apiRoutes.post(endpoint + '/by_date_interval', function(req, res) {
    return self.getByDateInterval(req, res);
  });

  apiRoutes.post(endpoint + '/by_date_interval/filter_by_year', function(req, res) {
    return self.getByDateIntervalFilterByYear(req, res);
  });

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
    return self.formOptions(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.agendamentos.All(models);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ agendamentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.agendamentos.Get(models, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ agendamento: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.agendamentos.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.agendamentos.Create(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ agendamento: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.agendamentos.Update(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ agendamento: entity });
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

    return models.agendamentos.getByClientes(models, scopes, req.body.data, req.body.cliente);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ agendamentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getNotQualifiedByClientes = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.agendamentos.getNotQualifiedByClientes(models, req.param('id'));

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ agendamentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByAno = function(req, res) {
  return sequelize.transaction(function(t) {
    scopes = [];

    return models.agendamentos.getByAno(req.body.ano, req.body.profissional);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ agendamentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByDateInterval = function(req, res) {
  return sequelize.transaction(function(t) {
    scopes = [];

    return models.agendamentos.getByDateInterval(req.body.dataInicio, req.body.dataFim, req.body.profissional);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ agendamentos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByDateIntervalFilterByYear = function(req, res) {
  return sequelize.transaction(function(t) {
    scopes = [];

    return models.agendamentos.getByDateIntervalFilterByYear(req.body.dataInicio, req.body.dataFim, req.body.profissional);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ agendamentos: entities });
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
