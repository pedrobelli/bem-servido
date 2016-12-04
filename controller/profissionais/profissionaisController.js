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

  apiRoutes.post(endpoint + '/edit', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.post(endpoint + '/by_uuid', function(req, res) {
    return self.getByUuid(req, res);
  });

  apiRoutes.post(endpoint + '/by_date_weekday', function(req, res) {
    return self.getByDateAdnWeekday(req, res);
  });

  apiRoutes.get(endpoint + '/get_score/:id', function(req, res) {
    return self.getScore(req, res);
  });

  apiRoutes.post(endpoint + '/search', function(req, res) {
    return self.search(req, res);
  });

  apiRoutes.get(endpoint + '/form_options', function(req, res) {
    return self.formOptions(req, res);
  });

  apiRoutes.get(endpoint + '/pesquisa/form_options', function(req, res) {
    return self.pesquisaFormOptions(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    // query = req.param('query');
    //
    // if (!!query) {
    //   return models.profissionais.Search(query);
    // } else {
      return models.profissionais.All();
    // }

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
    var newProfissional = models.profissionais.build({
      nome           : req.body.nome,
      uuid           : req.body.uuid,
      dataNascimento : req.body.dataNascimento,
      sexo           : req.body.sexo,
      cpf_cnpj       : req.body.cpf_cnpj,
      ramo           : req.body.ramo
    });
    return models.profissionais.Create(newProfissional.dataValues).then(function(profissional) {
      var telefone = models.telefones.build({
        telefone       : req.body.telefone,
        celular        : req.body.celular,
        profissionalId : profissional.id
      });
      return models.telefones.Create(telefone.dataValues).then(function() {
        var endereco = models.enderecos.build({
          cep            : req.body.cep,
          rua            : req.body.rua,
          num            : req.body.num,
          complemento    : req.body.complemento,
          bairro         : req.body.bairro,
          cidade         : req.body.cidade,
          estado         : req.body.estado,
          profissionalId : profissional.id
        });
        return models.enderecos.Create(endereco.dataValues).then(function() {
          var servicos = JSON.parse(req.body.servicos);
          return Promise.all(servicos.map(function(servico) {
            var newServico = models.detalhe_servicos.build({
              valor          : servico.valor,
              duracao        : servico.duracao,
              servicoId      : servico.servicoId,
              profissionalId : profissional.id
            });
            return models.detalhe_servicos.Create(newServico.dataValues)
          })).then(function() {
            var horasTrabalho = JSON.parse(req.body.horasTrabalho);
            return Promise.all(horasTrabalho.map(function(horaTrabalho) {
              var newHoraTrabalho = models.horas_trabalho.build({
                diaSemana      : horaTrabalho.diaSemana,
                horaInicio     : horaTrabalho.horaInicio,
                horaFim        : horaTrabalho.horaFim,
                profissionalId : profissional.id
              });
              return models.horas_trabalho.Create(newHoraTrabalho.dataValues)
            })).then(function() {
              return profissional.setHabilidades(JSON.parse(req.body.habilidades)).then(function() {
                return profissional;
              });
            });
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
    var profissional = models.profissionais.build({
      id             : req.body.id,
      nome           : req.body.nome,
      dataNascimento : req.body.dataNascimento,
      sexo           : req.body.sexo,
      cpf_cnpj       : req.body.cpf_cnpj
    });
    return models.profissionais.Update(profissional.dataValues).then(function(profissional) {
      var telefone = models.telefones.build({
        id       : req.body.telefoneId,
        telefone : req.body.telefone,
        celular  : req.body.celular
      });
      return models.telefones.Update(telefone.dataValues).then(function() {
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

self.getByUuid = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.FindByUuid(req.body.uuids);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ profissional: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByDateAdnWeekday = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.FindByDateAdnWeekday(models, req.body.id, req.body.data, req.body.diaSemana);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ profissional: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getScore = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.profissionais.GetScore(models, req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ profissional: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.search = function(req, res) {
  // var profissionais = [];
  return sequelize.transaction(function(t) {
    scopes = [];

    if (!!req.body.servico) {
      scopes.push({ method: ['byServiceName', models, req.body.servico] });
    }

    if (!!req.body.cidade) {
      scopes.push({ method: ['byCidade', models, req.body.cidade] });
    }

    if (!!req.body.data && !!req.body.diaSemana  && !!req.body.hora) {
      scopes.push({ method: ['byHora', models, req.body.data, req.body.diaSemana, req.body.hora] });
    }else if (!!req.body.data && !!req.body.diaSemana) {
      scopes.push({ method: ['byDiaSemanaEData', models, req.body.data, req.body.diaSemana] });
    }

    if (!!req.body.ramo) {
      scopes.push({ method: ['byRamo', req.body.ramo] });
    }

    if (!!req.body.habilidades && JSON.parse(req.body.habilidades).length > 0) {
      scopes.push({ method: ['byHabilidades', models, JSON.parse(req.body.habilidades)] });
    }

    if (!!req.body.home) {
      scopes.push({ method: ['home'] });
    }

    if (!req.body.home) {
      scopes.push({ method: ['notHome'] });
    }

    return models.profissionais.Search(models, scopes);
    // .then(function(response) {
    //   return Promise.all(response.map(function(profissional) {
    //     return models.profissionais.GetScore(models, profissional.dataValues.id).then(function(response) {
    //       profissional.dataValues.mediaNota = response.dataValues.mediaNota;
    //       profissionais.push(profissional);
    //     });
    //   }));
    // })
    // .then(function() {
    //   return profissionais;
    // });

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ profissionais: entities });
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

self.pesquisaFormOptions = function(req, res) {
  var options = {}
  options.ramos = enums.ramos;
  options.estados = enums.estados;
  options.diasSemana = enums.diasSemana;

  res.statusCode = 200;
  res.json(options);
}
