var models = require('../../models');

exports.createProfissionais = function() {
  var servicoIds = [];

  return models.servicos.Search('Corte Masculino').then(function(entities) {
    servicoIds.push(entities[0].id)
  })
  .then(function() {
    return models.servicos.Search('Corte Feminino').then(function(entities) {
      servicoIds.push(entities[0].id)
    });
  })
  .then(function() {
    return models.servicos.Search('Escova').then(function(entities) {
      servicoIds.push(entities[0].id)
    });
  })
  .then(function() {
    return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
      var profissional = models.profissionais.build({
        nome: 'Carol',
        email: 'carol@gmail.com'
      });

    return  models.profissionais.Create(profissional.dataValues).then(function(profissional) {
        profissional.setServicos(servicoIds);
        return profissional.setEspecialidades(entities);
      });
    });
  })
  .then(function() {
    servicoIds = [];

    return models.servicos.Search('Unha').then(function(entities) {
      servicoIds.push(entities[0].id)
    })
    .then(function() {
      return models.servicos.Search('Unha + cutícula').then(function(entities) {
        servicoIds.push(entities[0].id)
      });
    })
    .then(function() {
      return models.servicos.Search('Corte Feminino').then(function(entities) {
        servicoIds.push(entities[0].id)
      });
    })
    .then(function() {
      return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
        var profissional = models.profissionais.build({
          nome: 'Agatha',
          email: 'agatha@gmail.com'
        });

        return models.profissionais.Create(profissional.dataValues).then(function(profissional) {
          profissional.setServicos(servicoIds);
          return profissional.setEspecialidades(entities);
        });
      });
    })
    .then(function() {
      servicoIds = [];

      return models.servicos.Search('Unha').then(function(entities) {
        servicoIds.push(entities[0].id)
      })
      .then(function() {
        return models.servicos.Search('Unha + cutícula').then(function(entities) {
          servicoIds.push(entities[0].id)
        });
      })
      .then(function() {
        return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
          var profissional = models.profissionais.build({
            nome: 'Manoel',
            email: 'manoel@gmail.com'
          });

          return models.profissionais.Create(profissional.dataValues).then(function(profissional) {
            profissional.setServicos(servicoIds);
            return profissional.setEspecialidades(entities);
          });
        });
      })
      .then(function() {
        servicoIds = [];

        return models.servicos.Search('Avaliação').then(function(entities) {
          servicoIds.push(entities[0].id)
        })
        .then(function() {
          return models.servicos.Search('Trocar óleo').then(function(entities) {
            servicoIds.push(entities[0].id)
          });
        })
        .then(function() {
          return models.servicos.Search('Balanceamento').then(function(entities) {
            servicoIds.push(entities[0].id)
          });
        })
        .then(function() {
          return models.especialidades.FindByServicos(models, JSON.stringify(servicoIds)).then(function(entities) {
            var profissional = models.profissionais.build({
              nome: 'José',
              email: 'jose@gmail.com'
            });

            return models.profissionais.Create(profissional.dataValues).then(function(profissional) {
              profissional.setServicos(servicoIds);
              return profissional.setEspecialidades(entities);
            });
          });
        });
      });
    });
  });
}
