var models = require('../../models'),
    enums = require('../shared/enums');

exports.createEspecialidades = function() {
  var especialidade = models.especialidades.build({
    nome: 'Cabelereiro',
    ramo: enums.ramos.beleza.id,
    seed: true
  });
  models.especialidades.Create(especialidade.dataValues);

  especialidade = models.especialidades.build({
    nome: 'Manicure',
    ramo: enums.ramos.beleza.id,
    seed: true
  });
  models.especialidades.create(especialidade.dataValues);

  especialidade = models.especialidades.build({
    nome: 'Mecânico',
    ramo: enums.ramos.manutencao.id,
    seed: true
  });
  return models.especialidades.create(especialidade.dataValues);
}
