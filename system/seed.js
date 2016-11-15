var request                  = require('request'),
    deferred                 = require('deferred'),
    controllerHelper         = require('../controller/shared/controllerHelper'),
    especialidadesScenarios  = require('../controller/profissionais/especialidadesScenarios'),
    profissionaisScenarios   = require('../controller/profissionais/profissionaisScenarios'),
    detalheServicosScenarios = require('../controller/servicos/detalheServicosScenarios'),
    clientesScenarios        = require('../controller/clientes/clientesScenarios');

exports.runSeed = function() {
  deleteUsers().then(function() {
    var sequelize = controllerHelper.createSequelizeInstance();
    console.log('Seed Started');
    return sequelize.transaction(function(t) {
      return especialidadesScenarios.createEspecialidades().then(function() {
        return detalheServicosScenarios.createServicos().then(function() {
          // return profissionaisScenarios.createProfissionais();
        });
      })
      .then(function() {
        return clientesScenarios.createClientes();
      });

    }).then(function(entities) {
      console.log('Seed Ended');
    }).catch(function(errors) {
      console.log('Seed Error');
      console.log(errors);
      deleteUsers();
    });

  })
  .catch(function(error) {
    console.log(error);
  });
}

var deleteUsers = function() {
  var result = deferred();

  var options = {
    method: 'GET',
    url: 'https://pedrobelli.auth0.com/api/v2/users',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJkZWxldGUiXX0sInVzZXJfaWRwX3Rva2VucyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NzkyMzExODIsImp0aSI6ImMwMWQwNmE1NjRiMGMxM2FmODU5MmFiMGEyZGExOTE0In0.2STu-zS_STdygYfzcUSXrMtqLWe_G0nsDtozzlC-3E8',
      'content-type': 'application/json'
    }
  };

  request(options, function (error, response, body) {
    if (error)
      return result.reject(new Error(error));

    var users = JSON.parse(body);
    users.forEach(function(user) {
      options.url = 'https://pedrobelli.auth0.com/api/v2/users/' + encodeURIComponent(user.user_id)
      options.method = 'DELETE'
      request(options, function (error, response, body) {
        if (error)
          return result.reject(new Error(error));
      });
    });

    return result.resolve();
  });

  return result.promise();
}
