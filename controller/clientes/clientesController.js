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

  apiRoutes.post(endpoint + '/edit', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.post(endpoint + '/by_uuid', function(req, res) {
    return self.getByUuid(req, res);
  });

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
    return self.formOptions(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.clientes.All();

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ clientes: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.clientes.Get(models, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.clientes.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    var cliente = models.clientes.build({
      nome           : req.body.nome,
      uuid           : req.body.uuid,
      dataNascimento : req.body.dataNascimento,
      sexo           : req.body.sexo,
      cpf            : req.body.cpf,
      ramo           : req.body.ramo
    });
    return models.clientes.Create(cliente.dataValues).then(function(cliente) {
      var telefone = models.telefones.build({
        telefone  : req.body.telefone,
        celular   : req.body.celular,
        clienteId : cliente.id
      });
      return models.telefones.Create(telefone.dataValues).then(function() {
        var endereco = models.enderecos.build({
          cep         : req.body.cep,
          rua         : req.body.rua,
          num         : req.body.num,
          complemento : req.body.complemento,
          bairro      : req.body.bairro,
          cidade      : req.body.cidade,
          estado      : req.body.estado,
          clienteId   : cliente.id
        });
        return models.enderecos.Create(endereco.dataValues).then(function() {
          return cliente;
        });
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    var cliente = models.clientes.build({
      id             : req.body.id,
      nome           : req.body.nome,
      dataNascimento : req.body.dataNascimento,
      sexo           : req.body.sexo,
      cpf            : req.body.cpf
    });
    return models.clientes.Update(cliente.dataValues).then(function(cliente) {
      var telefone = models.telefones.build({
        id       : req.body.telefoneId,
        telefone : req.body.telefone,
        celular  : req.body.celular
      });
      return models.telefones.Update(telefone.dataValues).then(function() {
        return cliente;
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByUuid = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.clientes.FindByUuid(req.body.uuids);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ cliente: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  options.sexos = enums.sexos;
  options.estados = enums.estados;

  res.statusCode = 200;
  res.json(options);
}
