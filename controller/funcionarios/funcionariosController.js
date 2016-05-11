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

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
    return self.formOptions(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    query = req.param('query');

    if (!!query) {
      return models.funcionarios.Search(query);
    } else {
      return models.funcionarios.All();
    }

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({
      funcionarios: entities,
      placeholderOptions: ["Nome"],
    });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.funcionarios.Get(models, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ funcionario: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.funcionarios.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.funcionarios.Create(req).then(function(funcionario) {
      funcionario.setServicos(JSON.parse(req.param('servicos')));
      return funcionario.setEspecialidades(JSON.parse(req.param('especialidades'))).then(function() {
        return funcionario;
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ funcionario: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.funcionarios.Update(req).then(function(funcionario) {
      funcionario.setServicos(JSON.parse(req.param('servicos')));
      return funcionario.setEspecialidades(JSON.parse(req.param('especialidades'))).then(function() {
        return funcionario;
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ funcionario: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  return sequelize.transaction(function(t) {
    return models.servicos.All().then(function(entities) {
      options.servicos = entities;
    });

  }).then(function() {
    res.statusCode = 200;
    res.json(options);
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
