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

//agendamentos
db['agendamentos'].belongsTo(db['clientes'], { foreignKey: 'clienteId' });
db['agendamentos'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId', allowNull: false });
db['agendamentos'].belongsTo(db['detalhe_servicos'], { foreignKey: 'detalheServicoId' });
db['agendamentos'].hasMany(db['qualificacoes'], { foreignKey: 'agendamentoId' });

//clientes
db['qualificacoes'].belongsTo(db['agendamentos'], { foreignKey: 'agendamentoId' });
db['qualificacoes'].belongsTo(db['clientes'], { foreignKey: 'clienteId' });
db['qualificacoes'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId' });

//clientes
db['clientes'].hasOne(db['telefones'], { foreignKey: 'clienteId' });
db['clientes'].hasOne(db['enderecos'], { foreignKey: 'clienteId' });
db['clientes'].hasMany(db['agendamentos'], { foreignKey: 'clienteId' });
db['clientes'].hasMany(db['qualificacoes'], { foreignKey: 'clienteId' });

//detalheServicos
db['detalhe_servicos'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId', allowNull: false  });
db['detalhe_servicos'].belongsTo(db['servicos'], { foreignKey: 'servicoId', allowNull: false });
db['detalhe_servicos'].hasMany(db['agendamentos'], { foreignKey: 'detalheServicoId' });

//enderecos
db['enderecos'].belongsTo(db['clientes'], { foreignKey: 'clienteId' });
db['enderecos'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId' });

//formaPagamentos
db['forma_pagamentos'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId' });

//habilidades
db['habilidades'].belongsToMany(db['profissionais'], { through: 'profissional_habilidades' });
db['habilidades'].hasMany(db['servicos'], { foreignKey: 'habilidadeId', allowNull: false });

//profissionais
db['profissionais'].hasOne(db['telefones'], { foreignKey: 'profissionalId' });
db['profissionais'].hasOne(db['enderecos'], { foreignKey: 'profissionalId' });
db['profissionais'].hasMany(db['agendamentos'], { foreignKey: 'profissionalId', allowNull: false });
db['profissionais'].hasMany(db['horas_trabalho'], { foreignKey: 'profissionalId', allowNull: false });
db['profissionais'].hasMany(db['detalhe_servicos'], { foreignKey: 'profissionalId', allowNull: false });
db['profissionais'].hasMany(db['forma_pagamentos'], { foreignKey: 'profissionalId' });
db['profissionais'].hasMany(db['qualificacoes'], { foreignKey: 'profissionalId' });
db['profissionais'].belongsToMany(db['habilidades'], { foreignKey: 'profissionalId', through: 'profissional_habilidades' });

//horasTrabalho
db['horas_trabalho'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId', allowNull: false });

//servicos
db['servicos'].hasMany(db['detalhe_servicos'], { foreignKey: 'servicoId', allowNull: false });
db['servicos'].belongsTo(db['habilidades'], { foreignKey: 'habilidadeId', allowNull: false });

//telefones
db['telefones'].belongsTo(db['profissionais'], { foreignKey: 'profissionalId' });
db['telefones'].belongsTo(db['clientes'], { foreignKey: 'clienteId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
