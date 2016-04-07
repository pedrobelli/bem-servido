module.exports = function(sequelize, DataTypes) {

  var Atendimento = sequelize.define('atendimentos', {

    preco: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    data: {
      allowNull: false,
      type: DataTypes.DATE
    },
    duracao: {
      allowNull: true,
      type: DataTypes.DOUBLE
    }
  });
  return Atendimento
};
