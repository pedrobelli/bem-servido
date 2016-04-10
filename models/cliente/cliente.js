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
			Get: function(t, id){
				return this.find({ where: { id: id } }, {transaction: t});
			},
			Destroy: function(t, id){
				return this.find({ where: { id: id } }, {transaction: t}).then(function(entity) {
		      return entity.destroy({transaction: t});
		    });
			},
			Create: function(t, req){
				return this.create(req.body, {transaction: t});
			},
			Update: function(t, req){
				return this.find({ where: { id: req.param('id') } }, {transaction: t}).then(function(entity) {
		      return entity.updateAttributes(req.body, {transaction: t});
		    });
			}
		}
	});

	return Cliente;
};
