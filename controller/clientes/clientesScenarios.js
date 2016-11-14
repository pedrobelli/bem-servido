var models = require('../../models');

exports.createClientes = function() {
  var today = new Date();
  
  var cliente = models.clientes.build({
    nome: 'Marcelo',
    uuid: '3456765434567654',
    dataNascimento: today,
    cpf: '07593809960',
    sexo: 0
  });
  models.clientes.Create(cliente.dataValues);

  var cliente = models.clientes.build({
    nome: 'Camila',
    uuid: '3456765434567654',
    dataNascimento: today,
    cpf: '07593809960',
    sexo: 0
  });
  models.clientes.Create(cliente.dataValues);

  var cliente = models.clientes.build({
    nome: 'Leandro',
    uuid: '3456765434567654',
    dataNascimento: today,
    cpf: '07593809960',
    sexo: 0
  });
  models.clientes.Create(cliente.dataValues);

  var cliente = models.clientes.build({
    nome: 'Cezar',
    uuid: '3456765434567654',
    dataNascimento: today,
    cpf: '07593809960',
    sexo: 0
  });
  return models.clientes.Create(cliente.dataValues);
}
