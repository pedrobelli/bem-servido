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

  apiRoutes.delete(endpoint + '/:id/:profissional_id', function(req, res) {
    return self.destroy(req, res);
  });

  apiRoutes.post(endpoint + '/new', function(req, res) {
    return self.create(req, res);
  });

  apiRoutes.post(endpoint + '/edit/:id', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.post(endpoint + '/by_servicos', function(req, res) {
    return self.getByServicos(req, res);
  });

  apiRoutes.post(endpoint + '/by_profissional', function(req, res) {
    return self.getByProfissional(req, res);
  });

  apiRoutes.get(endpoint + '/seeded_by_ramo/:ramo_id', function(req, res) {
    return self.getSeededByRamo(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.especialidades.All();

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ especialidades: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.especialidades.Get(req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ especialidade: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissional_especialidades.Destroy(req.param('id'), req.param('profissional_id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.Get(models, req.body.profissionalId).then(function(profissional) {
      var newEspecialidade = models.especialidades.build({
        nome   : req.body.nome,
        ramo   : profissional.ramo,
        seeded : false
      });
      return models.especialidades.FindOrCreate(newEspecialidade.dataValues).then(function(entity) {
        return profissional.addEspecialidades(entity).then(function() {
          return entity;
        });
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ especialidade: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissional_especialidades.Destroy(req.body.id, req.body.profissionalId).then(function() {
      return models.profissionais.Get(models, req.body.profissionalId).then(function(profissional) {
        var newEspecialidade = models.especialidades.build({
          nome   : req.body.nome,
          ramo   : profissional.ramo,
          seeded : false
        });
        return models.especialidades.FindOrCreate(newEspecialidade.dataValues).then(function(entity) {
          return profissional.addEspecialidades(entity).then(function() {
            return entity;
          });
        });
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ especialidade: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByServicos = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.especialidades.FindByServicos(models, req.param('servicos'))

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ especialidades: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByProfissional = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.especialidades.FindByProfissional(models, req.body.profissional)

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ especialidades: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getSeededByRamo = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.especialidades.FindSeededByRamo(models, req.param('ramo_id'))

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ especialidades: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
