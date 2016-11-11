var models = require('../../models'),
    enums  = require('../shared/enums');

exports.createEspecialidades = function() {
  var especialidade = models.especialidades.build({
    nome: 'Cabelereiro',
    ramo: enums.ramos[1].id,
    seed: true
  });
  models.especialidades.Create(especialidade.dataValues);

  especialidade = models.especialidades.build({
    nome: 'Manicure',
    ramo: enums.ramos[1].id,
    seed: true
  });
  models.especialidades.create(especialidade.dataValues);

  especialidade = models.especialidades.build({
    nome: 'Mecânico',
    ramo: enums.ramos[3].id,
    seed: true
  });
  return models.especialidades.create(especialidade.dataValues);
}
