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

  apiRoutes.post(endpoint + '/validate_warning', function(req, res) {
    return self.validateWarning(req, res);
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
    return Promise.all(horasTrabalho.map(function(horaTrabalho) {
      return models.atendimentos.getFromTodayByWeekday(horaTrabalho.diaSemana).then(function(response) {
        response.forEach(function(atendimento) {
          models.atendimentos.Destroy(atendimento.id);
        });
      });
    })).then(function() {
      return models.horas_trabalho.Destroy(req.param('id'));
    });

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
    return Promise.all(horasTrabalho.map(function(horaTrabalho) {
      return models.atendimentos.getFromTodayByWeekdayAndTime(horaTrabalho).then(function(response) {
        response.forEach(function(atendimento) {
          models.atendimentos.Destroy(atendimento.id);
        });
      });
    })).then(function() {
      return models.horas_trabalho.Update(req.body)
    });

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

self.validateWarning = function(req, res) {
  var warnings = [];
  return sequelize.transaction(function(t) {

    var horasTrabalho = JSON.parse(req.body.horasTrabalho);
    return Promise.all(horasTrabalho.map(function(horaTrabalho) {
      if (horaTrabalho.checked && !!horaTrabalho.id) {
        return models.atendimentos.getFromTodayByWeekdayAndTime(horaTrabalho).then(function(response) {
          if (response.length > 0) warnings.push("Você tem agendamentos nos dias alterados/excluidos");
        });
      } else if (!horaTrabalho.checked && !!horaTrabalho.id) {
        return models.atendimentos.getFromTodayByWeekday(horaTrabalho.diaSemana).then(function(response) {
          if (response.length > 0) warnings.push("Você tem agendamentos nos dias alterados/excluidos");
        });
      }
    }));

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ warnings: warnings });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });

}
