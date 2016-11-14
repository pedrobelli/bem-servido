var models           = require('../../models'),
    enums            = require('../shared/enums'),
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
      return models.profissionais.Search(query);
    } else {
      return models.profissionais.All();
    }

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({
      profissionais: entities,
      placeholderOptions: ["Nome"],
    });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.Get(models, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ profissional: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    var newProfissional = {
      nome           : req.body.nome,
      uuid           : req.body.uuid,
      dataNascimento : req.body.dataNascimento,
      sexo           : req.body.sexo,
      cpf_cnpj       : req.body.cpf_cnpj,
      ramo           : req.body.ramo
    };
    return models.profissionais.Create(newProfissional).then(function(profissional) {
      var newTelefone = {
        telefone       : req.body.telefone,
        celular        : req.body.celular,
        profissionalId : profissional.id
      };
      return models.telefones.Create(newTelefone).then(function() {
        var newEndereco = {
          telefone       : req.body.telefone,
          celular        : req.body.celular,
          cep            : req.body.cep,
          rua            : req.body.rua,
          num            : req.body.num,
          complemento    : req.body.complemento,
          bairro         : req.body.bairro,
          cidade         : req.body.cidade,
          estado         : req.body.estado,
          profissionalId : profissional.id
        };
        return models.enderecos.Create(newEndereco).then(function() {
          var servicos = JSON.parse(req.body.servicos);
          servicos.forEach(function(servico) {
            servico.profissionalId = profissional.id;
            models.detalhe_servicos.Create(servico);
          });

          var horasTrabalho = JSON.parse(req.body.horasTrabalho);
          horasTrabalho.forEach(function(horaTrabalho) {
            horaTrabalho.profissionalId = profissional.id;
            models.horas_trabalho.Create(horaTrabalho);
          });

          return profissional.setEspecialidades(JSON.parse(req.body.especialidades)).then(function() {
            return profissional;
          });
        });
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ profissional: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.Update(req.body).then(function(profissional) {
      profissional.setServicos(JSON.parse(req.param('servicos')));
      return profissional.setEspecialidades(JSON.parse(req.param('especialidades'))).then(function() {
        return profissional;
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ profissional: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.formOptions = function(req, res) {
  var options = {}
  options.sexos = enums.sexos;
  options.ramos = enums.ramos;
  options.estados = enums.estados;
  options.horasTrabalho = enums.diasSemana;

  res.statusCode = 200;
  res.json(options);
}
