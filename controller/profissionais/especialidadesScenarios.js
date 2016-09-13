var models = require('../../models');

exports.createEspecialidades = function() {
  var especialidade = models.especialidades.build({
    nome: 'Cabelereiro'
  });
  models.especialidades.Create(especialidade.dataValues);

  especialidade = models.especialidades.build({
    nome: 'Manicure'
  });
  models.especialidades.create(especialidade.dataValues);

  especialidade = models.especialidades.build({
    nome: 'Mecânico'
  });
  return models.especialidades.create(especialidade.dataValues);
}
