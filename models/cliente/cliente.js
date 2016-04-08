module.exports = function(sequelize, DataTypes) {

	var Cliente = sequelize.define('clientes', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [3, 100]}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {isEmail: true}
		},
		telefone: {
			type: DataTypes.STRING,
			validate: {len: [11, 12]}
		},
		senha: {
			allowNull: false,
			type: DataTypes.STRING
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

	return Cliente;
};
