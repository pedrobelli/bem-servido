var models = require('../../models'),
    enums  = require('../shared/enums');

exports.createHabilidades = function() {
  var habilidade = models.habilidades.build({
    nome: 'Veterinário',
    ramo: enums.ramos[0].id,
    seed: true
  });
  models.habilidades.Create(habilidade.dataValues);

  habilidade = models.habilidades.build({
    nome: 'Cabelereiro',
    ramo: enums.ramos[1].id,
    seed: true
  });
  models.habilidades.Create(habilidade.dataValues);

  habilidade = models.habilidades.build({
    nome: 'Manicure',
    ramo: enums.ramos[1].id,
    seed: true
  });
  models.habilidades.create(habilidade.dataValues);

  habilidade = models.habilidades.build({
    nome: 'Clínico Geral',
    ramo: enums.ramos[2].id,
    seed: true
  });
  models.habilidades.create(habilidade.dataValues);

  habilidade = models.habilidades.build({
    nome: 'Dentista',
    ramo: enums.ramos[2].id,
    seed: true
  });
  models.habilidades.create(habilidade.dataValues);

  habilidade = models.habilidades.build({
    nome: 'Mecânico',
    ramo: enums.ramos[3].id,
    seed: true
  });
  return models.habilidades.create(habilidade.dataValues);
}
