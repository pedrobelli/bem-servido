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
      validate: {len: [5, 500]}
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
			},
			FindByServicos: function(t, models, servicoIds){
				return this.findAll({ include: [
          { model: models.servicos, where: { id: JSON.parse(servicoIds) } }
        ], transaction: t })
			}
		}
  });

  return Especialidade
};
