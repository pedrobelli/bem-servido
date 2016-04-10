var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  config = require('../config/config'),
  db = {};

var sequelize = new Sequelize(config.db);

var directories = fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
});

directories.forEach(function(directory){
  fs.readdirSync(__dirname+"/"+directory).filter(function (file){
    return (file.indexOf('.') !== 0)
  }).forEach(function (file) {
    var model = sequelize.import(path.join(__dirname+'/'+directory+'/'+file));
    db[model.name] = model;
  });
})


Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db['servicos'].belongsTo(db['especialidades'], { foreignKey: { allowNull: false } });
db['especialidades'].hasMany(db['servicos'], { foreignKey: { allowNull: false } });

db['servicos'].belongsToMany(db['prestadores'], { through: 'prestador_servicos' });
db['prestadores'].belongsToMany(db['servicos'], { through: 'prestador_servicos' });

db['especialidades'].belongsToMany(db['prestadores'], { through: 'prestador_especialidades' });
db['prestadores'].belongsToMany(db['especialidades'], { through: 'prestador_especialidades' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
