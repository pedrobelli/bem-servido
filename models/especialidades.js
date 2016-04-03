module.exports = function(sequelize, DataTypes) {

  var Especialidade = sequelize.define('especialidades', {

    nome: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {len: [3, 50]}
    },
    descricao: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {len: [10, 500]}
    },
    ativo: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  });
  return Especialidade
};
