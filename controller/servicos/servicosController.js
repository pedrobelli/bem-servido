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
      return db.servicos.Search(t, query);
    } else {
      return db.servicos.All(t);
    }

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({
      servicos: entities,
      placeholderOptions: ["Descrição"],
    });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.servicos.Get(t, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.servicos.Destroy(t, req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.servicos.Create(t, req);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return db.servicos.Update(t, req);

  }).then(function(entity) {
    console.log(entity);
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  return sequelize.transaction(function(t) {
    return db.especialidades.All(t).then(function(entities) {
      options.especialidades = entities;
    });

  }).then(function() {
    res.statusCode = 200;
    res.json(options);
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
