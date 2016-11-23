var request  = require('request'),
    deferred = require('deferred'),
    enums    = require('../shared/enums'),
    models   = require('../../models');

exports.createProfissionais = function() {
  var servicoIds = [];
  var dataNascimento = new Date(Date.parse('10/03/1975 00:00'));
  var horaInicio = new Date(new Date('1900-11-11 08:00:00'));
  var horaFim = new Date(new Date('1900-11-11 18:00:00'));

  var payload = {
    "connection": "Username-Password-Authentication",
    "email": "teste5@gmail.com",
    "password": "123456",
    "user_metadata": {
      "role": 2
    },
    "email_verified": true
  };

  var telefone = models.telefones.build({
    telefone       : '4134343232',
    celular        : '41988284545'
  });

  var endereco = models.enderecos.build({
    cep            : '82620380',
    rua            : 'Praça Hedwirges Nadolny',
    num            : '400',
    complemento    : '',
    bairro         : 'Santa Cândida',
    cidade         : 'Curitiba',
    estado         : 41
  });

  var servico = models.detalhe_servicos.build({
    valor          : 10.5,
    duracao        : 30,
  });

  var horaTrabalho = models.horas_trabalho.build({
    horaInicio     : horaInicio,
    horaFim        : horaFim
  });

  return models.servicos.Search('Corte Masculino').then(function(entities) {
    servicoIds.push(entities[0].id);
  })
  .then(function() {
    return models.servicos.Search('Corte Feminino').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.servicos.Search('Escova').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return createProfissional(payload).then(function(response) {
      return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
        var profissional = models.profissionais.build({
          nome           : 'Carol',
          uuid           : response.user_id,
          dataNascimento : dataNascimento,
          sexo           : 2,
          cpf_cnpj       : 92847502010,
          ramo           : 2
        });
        return  models.profissionais.Create(profissional.dataValues).then(function(profissional) {
          return createTelefoneAndEndereco(telefone, endereco, profissional.id).then(function() {
            return createServico(servico, servicoIds, profissional.id).then(function() {
              return createHoraTrabalho(horaTrabalho, profissional.id).then(function() {
                return profissional.setEspecialidades(entities);
              });
            });
          });
        });
      });
    });
  })
  .then(function() {
    servicoIds = [];

    return models.servicos.Search('Unha').then(function(entities) {
      servicoIds.push(entities[0].id);
    })
  })
  .then(function() {
    return models.servicos.Search('Unha + cutícula').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.servicos.Search('Corte Feminino').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    payload.email = "teste6@gmail.com";
    return createProfissional(payload).then(function(response) {
      return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
        var profissional = models.profissionais.build({
          nome           : 'Agatha',
          uuid           : response.user_id,
          dataNascimento : dataNascimento,
          sexo           : 2,
          cpf_cnpj       : 92847502020,
          ramo           : 2
        });
        return models.profissionais.Create(profissional.dataValues).then(function(profissional) {
          return createTelefoneAndEndereco(telefone, endereco, profissional.id).then(function() {
            return createServico(servico, servicoIds, profissional.id).then(function() {
              return createHoraTrabalho(horaTrabalho, profissional.id).then(function() {
                return profissional.setEspecialidades(entities);
              });
            });
          });
        });
      });
    });
  })
  .then(function() {
    servicoIds = [];

    return models.servicos.Search('Unha').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.servicos.Search('Unha + cutícula').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
      payload.email = "teste7@gmail.com";
      return createProfissional(payload).then(function(response) {
        var profissional = models.profissionais.build({
          nome           : 'Manoel',
          uuid           : response.user_id,
          dataNascimento : dataNascimento,
          sexo           : 1,
          cpf_cnpj       : 92847502030,
          ramo           : 2
        });
        return models.profissionais.Create(profissional.dataValues).then(function(profissional) {
          return createTelefoneAndEndereco(telefone, endereco, profissional.id).then(function() {
            return createServico(servico, servicoIds, profissional.id).then(function() {
              return createHoraTrabalho(horaTrabalho, profissional.id).then(function() {
                return profissional.setEspecialidades(entities);
              });
            });
          });
        });
      });
    });
  })
  .then(function() {
    servicoIds = [];

    return models.servicos.Search('Avaliação').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.servicos.Search('Trocar óleo').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.servicos.Search('Balanceamento').then(function(entities) {
      servicoIds.push(entities[0].id);
    });
  })
  .then(function() {
    return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
      payload.email = "teste8@gmail.com";
      return createProfissional(payload).then(function(response) {
        var profissional = models.profissionais.build({
          nome           : 'José',
          uuid           : response.user_id,
          dataNascimento : dataNascimento,
          sexo           : 1,
          cpf_cnpj       : 92847502040,
          ramo           : 4
        });
        return models.profissionais.Create(profissional.dataValues).then(function(profissional) {
          return createTelefoneAndEndereco(telefone, endereco, profissional.id).then(function() {
            return createServico(servico, servicoIds, profissional.id).then(function() {
              return createHoraTrabalho(horaTrabalho, profissional.id).then(function() {
                return profissional.setEspecialidades(entities);
              });
            });
          });
        });
      });
    });
  });
}

var createProfissional = function(payload) {
  var result = deferred();

  var options = {
    method: 'POST',
    url: 'https://pedrobelli.auth0.com/api/v2/users',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQ3OTIzNDkxMywianRpIjoiNWM2NTc5ZmVlNDcxMzIwMDM5YmE3MGY4MmE1N2JjY2YifQ.0byA_BualHBCiblgfjM9004hV0r_pMw8MK-Ewpz0HX4',
      'content-type': 'application/json'
    },
    form: payload
  };

  request(options, function (error, response, body) {
    if (error)
      result.reject(new Error(error));

    return result.resolve(JSON.parse(body));
  });

  return result.promise();
}

var createTelefoneAndEndereco = function(telefone, endereco, profissionalId) {
  telefone.dataValues.profissionalId = profissionalId;
  return models.telefones.Create(telefone.dataValues).then(function() {
    endereco.dataValues.profissionalId = profissionalId;
    return models.enderecos.Create(endereco.dataValues);
  });
}

var createServico = function(servico, servicoIds, profissionalId) {
  return Promise.all(servicoIds.map(function(servicoId) {
    servico.dataValues.servicoId = servicoId;
    servico.dataValues.profissionalId = profissionalId;
    return models.detalhe_servicos.Create(servico.dataValues);
  }));
}

var createHoraTrabalho = function(horaTrabalho, profissionalId) {
  return Promise.all(enums.diasSemana.map(function(diaSemana) {
    horaTrabalho.dataValues.diaSemana = diaSemana.id;
    horaTrabalho.dataValues.profissionalId = profissionalId;
    return models.horas_trabalho.Create(horaTrabalho.dataValues);
  }));
}
