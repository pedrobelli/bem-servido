var db               = require('../../models'),
    controllerHelper = require('../shared/controllerHelper');

var sequelize = controllerHelper.createSequelizeInstance();

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get(endpoint, function(req, res) {
    return index(req, res);
  });

  apiRoutes.get(endpoint + '/get/:id', function(req, res) {
    return get(req, res);
  });

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return destroy(req, res);
  });

  apiRoutes.post(endpoint, function(req, res) {
    return create(req, res);
  });

  apiRoutes.post(endpoint + '/:id', function(req, res) {
    return update(req, res);
  });

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
    return formOptions(req, res);
  });
}

index = function(req, res) {
  return sequelize.transaction(function(t) {

    return db.servicos.All(t);

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ servicos: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

get = function(req, res) {
  return sequelize.transaction(function(t) {

    return db.servicos.Get(t, req);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

destroy = function(req, res) {
  return sequelize.transaction(function(t) {

    return db.servicos.Destroy(t, req);

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

create = function(req, res) {
  return sequelize.transaction(function(t) {

    return db.servicos.Create(t, req);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

update = function(req, res) {
  return sequelize.transaction(function(t) {

    return db.servicos.Update(t, req);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ servico: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

formOptions = function(req, res) {
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
