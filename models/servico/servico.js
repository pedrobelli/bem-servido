module.exports = function(sequelize, DataTypes) {

	var Servico = sequelize.define('servicos', {
		descricao: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [5, 100]}
		},
		valor: {
			allowNull: false,
			type: DataTypes.DOUBLE,
			validate: {isFloat: true}
		}
	}, {
		classMethods: {
			All: function(t){
				return this.findAll({transaction: t});
			},
			Get: function(t, req){
				return this.find({ where: { id: req.param('id') } }, {transaction: t});
			},
			Destroy: function(t, req){
				return this.find({ where: { id: req.param('id') } }, {transaction: t}).then(function(entity) {
		      entity.destroy({transaction: t});
		    });
			},
			Create: function(t, req){
				return this.create(req.body, {transaction: t});
			},
			Update: function(t, req){
				return this.find({ where: { id: req.param('id') } }, {transaction: t}).then(function(entity) {
		      entity.updateAttributes(req.body, {transaction: t});
		    });
			}
		}
	});

	return Servico;
};
