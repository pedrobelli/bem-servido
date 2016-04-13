var db               = require('../../models'),
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
      return db.funcionarios.Search(t, query);
    } else {
      return db.funcionarios.All(t);
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
  funcionarioDecorator = {}
  return sequelize.transaction(function(t) {
    return db.funcionarios.Get(t, req.param('id')).then(function(funcionario) {
      funcionarioDecorator.model = funcionario
      return funcionario.getServicos({attributes: ['id']}, { transaction: t }).then(function(servicos) {
        funcionarioDecorator.servicos = servicos;
        return funcionario.getEspecialidades({attributes: ['id']}, { transaction: t }).then(function(especialidades) {
          funcionarioDecorator.especialidades = especialidades;
          return funcionarioDecorator
        });
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ funcionario: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.funcionarios.Destroy(t, req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.funcionarios.Create(t, req).then(function(funcionario) {
      funcionario.setServicos(JSON.parse(req.param('servicos')), { transaction: t });
      return funcionario.setEspecialidades(JSON.parse(req.param('especialidades')), { transaction: t }).then(function() {
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
    return db.funcionarios.Update(t, req).then(function(funcionario) {
      funcionario.setServicos(JSON.parse(req.param('servicos')), { transaction: t });
      return funcionario.setEspecialidades(JSON.parse(req.param('especialidades')), { transaction: t }).then(function() {
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
    return db.servicos.All(t).then(function(entities) {
      options.servicos = entities;
    });

  }).then(function() {
    res.statusCode = 200;
    res.json(options);
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
