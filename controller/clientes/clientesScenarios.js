var models = require('../../models');

exports.createClientes = function() {
  var cliente = models.clientes.build({
    nome: 'Marcelo',
    email: 'marcelo@gmail.com',
    senha: '12345678'
  });
  models.clientes.Create(cliente.dataValues);

  var cliente = models.clientes.build({
    nome: 'Camila',
    email: 'camila@gmail.com',
    senha: '12345678'
  });
  models.clientes.Create(cliente.dataValues);

  var cliente = models.clientes.build({
    nome: 'Leandro',
    email: 'landro@gmail.com',
    senha: '12345678'
  });
  models.clientes.Create(cliente.dataValues);

  var cliente = models.clientes.build({
    nome: 'Cezar',
    email: 'cezar@gmail.com',
    senha: '12345678'
  });
  return models.clientes.Create(cliente.dataValues);
}
