var models = require('../../models');

exports.createServicos = function() {
  models.especialidades.Search('Cabelereiro').then(function(entities) {
    var cabelereiro = entities[0];

    var servico = models.servicos.build({
      descricao: "Corte Masculino",
      valor: 14.5,
      especialidadeId: cabelereiro.id
    });
    models.servicos.Create(servico.dataValues);

    servico = models.servicos.build({
      descricao: "Corte Feminino",
      valor: 14.5,
      especialidadeId: cabelereiro.id
    });
    models.servicos.Create(servico.dataValues);

    servico = models.servicos.build({
      descricao: "Escova",
      valor: 20,
      especialidadeId: cabelereiro.id
    });
    models.servicos.Create(servico.dataValues);
  });

  models.especialidades.Search('Manicure').then(function(entities) {
    var manicure = entities[0];

    var servico = models.servicos.build({
      descricao: "Unha",
      valor: 15,
      especialidadeId: manicure.id
    });
    models.servicos.Create(servico.dataValues);

    servico = models.servicos.build({
      descricao: "Unha + cutícula",
      valor: 20,
      especialidadeId: manicure.id
    });
    models.servicos.Create(servico.dataValues);
  });

  return models.especialidades.Search('Mecânico').then(function(entities) {
    var mecanico = entities[0];

    servico = models.servicos.build({
      descricao: "Avaliação",
      valor: 50,
      especialidadeId: mecanico.id
    });
    models.servicos.Create(servico.dataValues);

    var servico = models.servicos.build({
      descricao: "Trocar óleo",
      valor: 40,
      especialidadeId: mecanico.id
    });
    models.servicos.Create(servico.dataValues);

    servico = models.servicos.build({
      descricao: "Balanceamento",
      valor: 35,
      especialidadeId: mecanico.id
    });
    return models.servicos.Create(servico.dataValues);
  });
}
