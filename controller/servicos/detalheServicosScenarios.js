var models = require('../../models');

exports.createServicos = function() {
  models.habilidades.Search('Cabelereiro').then(function(entities) {
    var cabelereiro = entities[0];

    var servico = models.servicos.build({
      nome: "Corte Masculino",
      habilidadeId: cabelereiro.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 14.5,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      // models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });

    servico = models.servicos.build({
      nome: "Corte Feminino",
      habilidadeId: cabelereiro.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 14.5,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      // models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });

    servico = models.servicos.build({
      nome: "Escova",
      habilidadeId: cabelereiro.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 20,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      // models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });
  });

  models.habilidades.Search('Manicure').then(function(entities) {
    var manicure = entities[0];

    servico = models.servicos.build({
      nome: "Unha",
      habilidadeId: manicure.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 15,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      // models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });

    servico = models.servicos.build({
      nome: "Unha + cutícula",
      habilidadeId: manicure.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 20,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      // models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });
  });

  return models.habilidades.Search('Mecânico').then(function(entities) {
    var mecanico = entities[0];

    servico = models.servicos.build({
      nome: "Avaliação",
      habilidadeId: mecanico.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 50,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      //  models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });

    servico = models.servicos.build({
      nome: "Trocar óleo",
      habilidadeId: mecanico.id,
      seed: true
    });
    models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 40,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      //  models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });

    servico = models.servicos.build({
      nome: "Balanceamento",
      habilidadeId: mecanico.id,
      seed: true
    });
    return models.servicos.FindOrCreate(servico.dataValues).then(function(entity) {
      // var detalheServico = models.detalhe_servicos.build({
      //   valor: 35,
      //   duracao: 30,
      //   servicoId: entity.id
      // });
      //
      //  return models.detalhe_servicos.FindOrCreate(detalheServico.dataValues);
    });
  });
}
