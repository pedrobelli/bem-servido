var fs        = require('fs'),
    path      = require('path'),
    Sequelize = require('sequelize'),
    config    = require('../config/config'),
    cls       = require('continuation-local-storage'),
    namespace = cls.createNamespace('bemservido'),
    db        = {};

Sequelize.cls = namespace
var sequelize = new Sequelize(config.db, { timezone : "-02:00"});

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
db['atendimentos'].belongsTo(db['clientes'], { foreignKey: { name: 'clienteId', allowNull: false } });
db['atendimentos'].belongsTo(db['profissionais'], { foreignKey: { name: 'profissionalId', allowNull: false } });
db['atendimentos'].belongsTo(db['servicos'], { foreignKey: { name: 'servicoId', allowNull: false } });

//clientes
db['clientes'].hasMany(db['atendimentos'], { foreignKey: { name: 'clienteId', allowNull: false } });

//detalheServicos
db['detalhe_servicos'].belongsTo(db['profissionais'], { foreignKey: { name: 'profissionalId', allowNull: false }  });
db['detalhe_servicos'].belongsTo(db['servicos'], { foreignKey: { name: 'servicoId', allowNull: false } });

//enderecos
db['enderecos'].belongsTo(db['profissionais'], {foreignKey : 'profissionalId'});

//formaPagamentos
db['forma_pagamentos'].belongsTo(db['profissionais'], {foreignKey : 'profissionalId'});

//especialidades
db['especialidades'].belongsToMany(db['profissionais'], { through: 'profissional_especialidades' });
db['especialidades'].hasMany(db['servicos'], { foreignKey: { name: 'especialidadeId', allowNull: false } });

//profissionais
db['profissionais'].hasOne(db['telefones'], {foreignKey : 'profissionalId'});
db['profissionais'].hasOne(db['enderecos'], {foreignKey : 'profissionalId'});
db['profissionais'].hasMany(db['atendimentos'], { foreignKey: { name: 'profissionalId', allowNull: false } });
db['profissionais'].hasMany(db['horas_trabalho'], {foreignKey : 'profissionalId', allowNull: false });
db['profissionais'].hasMany(db['detalhe_servicos'], {foreignKey : 'profissionalId', allowNull: false });
db['profissionais'].hasMany(db['forma_pagamentos'], {foreignKey : 'profissionalId'});
db['profissionais'].belongsToMany(db['especialidades'], { foreignKey : 'profissionalId', through: 'profissional_especialidades' });

//horasTrabalho
db['horas_trabalho'].belongsTo(db['profissionais'], {foreignKey : 'profissionalId', allowNull: false });

//servicos
db['servicos'].hasMany(db['atendimentos'], { foreignKey: { name: 'servicoId', allowNull: false } });
db['servicos'].hasMany(db['detalhe_servicos'], { foreignKey: { name: 'servicoId', allowNull: false } });
db['servicos'].belongsTo(db['especialidades'], { foreignKey: { name: 'especialidadeId', allowNull: false } });

//telefones
db['telefones'].belongsTo(db['profissionais'], {foreignKey : 'profissionalId'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
