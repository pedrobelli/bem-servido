var fs        = require('fs'),
    path      = require('path'),
    Sequelize = require('sequelize'),
    config    = require('../config/config'),
    cls       = require('continuation-local-storage'),
    namespace = cls.createNamespace('bemservido'),
    db        = {};

Sequelize.cls = namespace
var sequelize = new Sequelize(config.db, { timezone : "-03:00"});

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

//atendimentos
db['atendimentos'].belongsTo(db['profissionais'], { foreignKey: { allowNull: false } });
db['atendimentos'].belongsTo(db['servicos'], { foreignKey: { allowNull: false } });
db['atendimentos'].belongsTo(db['clientes'], { foreignKey: { allowNull: false } });

//clientes
db['clientes'].hasMany(db['atendimentos'], { foreignKey: { allowNull: false } });

//especialidades
db['especialidades'].hasMany(db['servicos'], { foreignKey: { allowNull: false } });
db['especialidades'].belongsToMany(db['profissionais'], { through: 'profissional_especialidades' });

//profissionais
db['profissionais'].hasMany(db['atendimentos'], { foreignKey: { allowNull: false } });
db['profissionais'].belongsToMany(db['servicos'], { through: 'profissional_servicos' });
db['profissionais'].belongsToMany(db['especialidades'], { through: 'profissional_especialidades' });

//servicos
db['servicos'].hasMany(db['atendimentos'], { foreignKey: { allowNull: false } });
db['servicos'].belongsTo(db['especialidades'], { foreignKey: { allowNull: false } });
db['servicos'].belongsToMany(db['profissionais'], { through: 'profissional_servicos' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
