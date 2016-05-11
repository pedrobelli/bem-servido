module.exports = function(sequelize, DataTypes) {

  var Atendimento = sequelize.define('atendimentos', {
    valorTotal: {
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
  }, {
		classMethods: {
			All: function(t){
				return this.findAll({transaction: t});
			},
			Get: function(t, id){
				return this.find({ where: { id: id }, transaction: t});
			},
			Destroy: function(t, id){
				return this.find({ where: { id: id }, transaction: t}).then(function(entity) {
		      return entity.destroy({transaction: t});
		    });
			},
			Create: function(t, req){
				return this.create(req.body, {transaction: t});
			},
			Update: function(t, req){
				return this.find({ where: { id: req.param('id') }, transaction: t}).then(function(entity) {
		      return entity.updateAttributes(req.body, {transaction: t});
		    });
			}
		}
	});

  return Atendimento
};
