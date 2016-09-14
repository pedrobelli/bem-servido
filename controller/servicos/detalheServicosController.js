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

  apiRoutes.post(endpoint + '/create', function(req, res) {
    return self.create(req, res);
  });

  apiRoutes.post(endpoint + '/edit/:id', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
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
    return models.servicos.FindOrCreate(req.body).then(function(entity) {
      
      req.body.servicoId = entity.id;
      return models.detalhe_servicos.FindOrCreate(req.body);
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    var payload = {
      nome            : 'Caramba',
      especialidadeId : '1',
    }
    return models.servicos.FindOrCreate(payload).then(function(entity) {

      req.body.servicoId = entity.id;
      return models.detalhe_servicos.Update(req.body);
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  return sequelize.transaction(function(t) {
    return models.especialidades.All().then(function(entities) {
      options.especialidades = entities;
    });

  }).then(function() {
    res.statusCode = 200;
    res.json(options);
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
