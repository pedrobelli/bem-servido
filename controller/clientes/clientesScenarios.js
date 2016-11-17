var request  = require('request'),
    deferred = require('deferred'),
    models   = require('../../models');

exports.createClientes = function() {
  var today = new Date();

  var payload = {
    "connection": "Username-Password-Authentication",
    "email": "teste1@gmail.com",
    "password": "123456",
    "user_metadata": {
      "role": 1
    },
    "email_verified": true
  };

  var telefone = models.telefones.build({
    telefone       : '4134343232',
    celular        : '41988284545'
  });

  var endereco = models.enderecos.build({
    cep            : 82620380,
    rua            : 'Avenida do Seed',
    num            : '843',
    complemento    : '',
    bairro         : 'Bairro do Teste',
    cidade         : 'Curitiba',
    estado         : 41
  });

  return createUser(payload).then(function(response) {
    var cliente = models.clientes.build({
      nome: 'Marcelo',
      uuid: response.user_id,
      dataNascimento: today,
      cpf: '07593809961',
      sexo: 1
    });
    return models.clientes.Create(cliente.dataValues).then(function(cliente) {
      return createTelefoneAndEndereco(telefone, endereco, cliente.id);
    });
  })
  .then(function() {
    payload.email = "teste2@gmail.com"
    return createUser(payload).then(function(response) {
      var cliente = models.clientes.build({
        nome: 'Camila',
        uuid: response.user_id,
        dataNascimento: today,
        cpf: '07593809962',
        sexo: 2
      });
      return models.clientes.Create(cliente.dataValues).then(function(cliente) {
        return createTelefoneAndEndereco(telefone, endereco, cliente.id);
      });
    });
  })
  .then(function() {
    payload.email = "teste3@gmail.com"
    return createUser(payload).then(function(response) {
      var cliente = models.clientes.build({
        nome: 'Leandro',
        uuid: response.user_id,
        dataNascimento: today,
        cpf: '07593809963',
        sexo: 1
      });
      return models.clientes.Create(cliente.dataValues).then(function(cliente) {
        return createTelefoneAndEndereco(telefone, endereco, cliente.id);
      });
    });
  })
  .then(function() {
    payload.email = "teste4@gmail.com"
    return createUser(payload).then(function(response) {
      var cliente = models.clientes.build({
        nome: 'Cezar',
        uuid: response.user_id,
        dataNascimento: today,
        cpf: '07593809964',
        sexo: 1
      });
      return models.clientes.Create(cliente.dataValues).then(function(cliente) {
        return createTelefoneAndEndereco(telefone, endereco, cliente.id);
      });
    });
  });

}

var createUser = function(payload) {
  var result = deferred();

  var options = {
    method: 'POST',
    url: 'https://pedrobelli.auth0.com/api/v2/users',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQ3OTIzNDkxMywianRpIjoiNWM2NTc5ZmVlNDcxMzIwMDM5YmE3MGY4MmE1N2JjY2YifQ.0byA_BualHBCiblgfjM9004hV0r_pMw8MK-Ewpz0HX4',
      'content-type': 'application/json'
    },
    form: payload
  };

  request(options, function (error, response, body) {
    if (error)
      result.reject(new Error(error));

    return result.resolve(JSON.parse(body));
  });

  return result.promise();
}

var createTelefoneAndEndereco = function(telefone, endereco, clienteId) {
  telefone.dataValues.clienteId = clienteId;
  return models.telefones.Create(telefone.dataValues).then(function() {
    endereco.dataValues.clienteId = clienteId;
    return models.enderecos.Create(endereco.dataValues);
  });
}
