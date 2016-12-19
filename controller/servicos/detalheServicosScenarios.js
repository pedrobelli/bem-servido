var models = require('../../models');

exports.createServicos = function() {
  models.habilidades.Search('Veterinário').then(function(entities) {
    var veterinario = entities[0];

    var servico = models.servicos.build({
      nome: "Banho",
      habilidadeId: veterinario.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Banho + tosa",
      habilidadeId: veterinario.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Tosa higiênica",
      habilidadeId: veterinario.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);
  });

  models.habilidades.Search('Cabelereiro').then(function(entities) {
    var cabelereiro = entities[0];

    var servico = models.servicos.build({
      nome: "Corte Masculino",
      habilidadeId: cabelereiro.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Corte Feminino",
      habilidadeId: cabelereiro.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Escova",
      habilidadeId: cabelereiro.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);
  });

  models.habilidades.Search('Manicure').then(function(entities) {
    var manicure = entities[0];

    servico = models.servicos.build({
      nome: "Unha",
      habilidadeId: manicure.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Unha + cutícula",
      habilidadeId: manicure.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);
  });

  models.habilidades.Search('Clínico Geral').then(function(entities) {
    var clinico = entities[0];

    servico = models.servicos.build({
      nome: "Consulta",
      habilidadeId: clinico.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);
  });

  models.habilidades.Search('Dentista').then(function(entities) {
    var Dentista = entities[0];

    servico = models.servicos.build({
      nome: "Consulta",
      habilidadeId: Dentista.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Avaliação",
      habilidadeId: Dentista.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Limpeza",
      habilidadeId: Dentista.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "tratamento de canal",
      habilidadeId: Dentista.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);
  });

  return models.habilidades.Search('Mecânico').then(function(entities) {
    var mecanico = entities[0];

    servico = models.servicos.build({
      nome: "Avaliação",
      habilidadeId: mecanico.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Trocar óleo",
      habilidadeId: mecanico.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues);

    servico = models.servicos.build({
      nome: "Balanceamento",
      habilidadeId: mecanico.id,
      seed: true
    });
    return models.servicos.FindOrCreate(servico.dataValues);
  });
}
