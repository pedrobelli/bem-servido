var controllerHelper        = require('../controller/shared/controllerHelper'),
    especialidadesScenarios = require('../controller/profissionais/especialidadesScenarios'),
    profissionaisScenarios  = require('../controller/profissionais/profissionaisScenarios'),
    servicosScenarios       = require('../controller/servicos/servicosScenarios'),
    clientesScenarios       = require('../controller/clientes/clientesScenarios');

exports.runSeed = function() {
  var sequelize = controllerHelper.createSequelizeInstance();
  console.log('Seed Started');
  return sequelize.transaction(function(t) {
    return especialidadesScenarios.createEspecialidades().then(function() {
      return servicosScenarios.createServicos().then(function() {
        return profissionaisScenarios.createProfissionais();
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
  });
}
