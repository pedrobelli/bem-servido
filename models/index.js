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
db['atendimentos'].belongsTo(db['clientes'], { foreignKey: { allowNull: false } });
db['atendimentos'].belongsTo(db['profissionais'], { foreignKey: { allowNull: false } });
db['atendimentos'].belongsTo(db['servicos'], { foreignKey: { allowNull: false } });

//clientes
db['clientes'].hasMany(db['atendimentos'], { foreignKey: { allowNull: false } });

//detalheServicos
db['detalhe_servicos'].belongsTo(db['profissionais'], { through: 'profissional_detalhe_servicos' });
db['detalhe_servicos'].belongsTo(db['servicos'], { foreignKey: { allowNull: false } });

//enderecos
db['enderecos'].belongsTo(db['profissionais']);

//formaPagamentos
db['forma_pagamentos'].belongsTo(db['profissionais']);

//especialidades
db['especialidades'].belongsToMany(db['profissionais'], { through: 'profissional_especialidades' });
db['especialidades'].hasMany(db['servicos'], { foreignKey: { allowNull: false } });

//profissionais
db['profissionais'].hasOne(db['telefones']);
db['profissionais'].hasOne(db['enderecos']);
db['profissionais'].hasMany(db['atendimentos'], { foreignKey: { allowNull: false } });
db['profissionais'].hasMany(db['detalhe_servicos']);
db['profissionais'].hasMany(db['forma_pagamentos']);
db['profissionais'].belongsToMany(db['especialidades'], { through: 'profissional_especialidades' });

//servicos
db['servicos'].hasMany(db['atendimentos'], { foreignKey: { allowNull: false } });
db['servicos'].hasMany(db['detalhe_servicos'], { foreignKey: { allowNull: false } });
db['servicos'].belongsTo(db['especialidades'], { foreignKey: { allowNull: false } });

//telefones
db['telefones'].belongsTo(db['profissionais']);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
