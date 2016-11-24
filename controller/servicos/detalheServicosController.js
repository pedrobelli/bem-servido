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

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return self.destroy(req, res);
  });

  apiRoutes.post(endpoint + '/new', function(req, res) {
    return self.create(req, res);
  });

  apiRoutes.post(endpoint + '/edit/:id', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.post(endpoint + '/by_profissional', function(req, res) {
    return self.getByProfissional(req, res);
  });

  apiRoutes.get(endpoint + '/form_options/:profissional_id', function(req, res) {
    return self.formOptions(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    query = req.param('query');

    if (!!query) {
      return models.detalhe_servicos.Search(models, query)
    } else {
      return models.detalhe_servicos.All(models);
    }

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({
      detalheServicos: entities,
      placeholderOptions: ["Descrição"],
    });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.detalhe_servicos.Get(models, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ detalheServico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.detalhe_servicos.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    var newServico = models.servicos.build({
      nome            : req.body.nome,
      especialidadeId : req.body.especialidadeId
    });
    return models.servicos.FindOrCreate(newServico.dataValues).then(function(entity) {
      var newDetalheServico = models.detalhe_servicos.build({
        valor          : req.body.valor,
        duracao        : req.body.duracao,
        servicoId      : entity.id,
        profissionalId : req.body.profissionalId
      });
      return models.detalhe_servicos.FindOrCreate(newDetalheServico.dataValues);
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ detalheServico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    var newServico = models.servicos.build({
      nome            : req.body.nome,
      especialidadeId : req.body.especialidadeId
    });
    return models.servicos.FindOrCreate(newServico.dataValues).then(function(entity) {
      var newDetalheServico = models.detalhe_servicos.build({
        id             : req.body.id,
        valor          : req.body.valor,
        duracao        : req.body.duracao,
        servicoId      : entity.id,
        profissionalId : req.body.profissionalId
      });
      return models.detalhe_servicos.Update(newDetalheServico.dataValues);
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ detalheServico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByProfissional = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.detalhe_servicos.FindByProfissional(models, req.body.profissional)

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ detalheServicos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  return sequelize.transaction(function(t) {
    return models.especialidades.FindByProfissional(models, req.param('profissional_id')).then(function(entities) {
      options.especialidades = entities;
    });

  }).then(function() {
    res.statusCode = 200;
    res.json(options);
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
