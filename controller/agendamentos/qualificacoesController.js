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

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return self.destroy(req, res);
  });

  apiRoutes.post(endpoint + '/new', function(req, res) {
    return self.create(req, res);
  });

  apiRoutes.post(endpoint + '/edit', function(req, res) {
    return self.update(req, res);
  });

  apiRoutes.post(endpoint + '/by_profissional', function(req, res) {
    return self.getByProfissional(req, res);
  });
}

self.index = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.qualificacoes.All();

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ qualificacoes: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.get = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.qualificacoes.Get(req.param('id'));

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ qualificacao: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.destroy = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.qualificacoes.Destroy(req.param('id'));

  }).then(function(entity) {
    res.send(204)
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.create = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.qualificacoes.Create(req.body).then(function(qualificacao) {
      return models.agendamentos.Get(models, qualificacao.agendamentoId).then(function(agendamento) {
        var newAgendamento = models.agendamentos.build({
          id          : qualificacao.agendamentoId,
          dataInicio  : agendamento.dataInicio.setHours ( agendamento.dataInicio.getHours() + 2 ),
          dataFim     : agendamento.dataFim.setHours ( agendamento.dataFim.getHours() + 2 ),
          qualificado : true
        });
        return models.agendamentos.Update(newAgendamento.dataValues).then(function() {
          return qualificacao;
        });
      });
    });

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ qualificacao: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.update = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.qualificacoes.Update(req.body);

  }).then(function(entity) {
    res.statusCode = 200;
    res.json({ qualificacao: entity });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}

self.getByProfissional = function(req, res) {
  return sequelize.transaction(function(t) {
    return models.qualificacoes.FindByProfissional(models, req.body.profissional)

  }).then(function(entities) {
    res.statusCode = 200;
    res.json({ qualificacoes: entities });
  }).catch(function(errors) {
    return controllerHelper.writeErrors(res, errors);
  });
}
