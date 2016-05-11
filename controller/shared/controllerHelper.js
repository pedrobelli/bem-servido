var Sequelize = require('sequelize'),
    config    = require('../../config/config');

exports.writeErrors = function(res, errors) {
  res.statusCode = 400;
  console.log("===== ERROR =====");
  console.log(errors);
  res.json({errors: errors});
}

exports.createSequelizeInstance = function() {
  var sequelize = new Sequelize(config.db);

  return sequelize;
}
