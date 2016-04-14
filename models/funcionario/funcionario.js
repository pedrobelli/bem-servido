module.exports = function(sequelize, DataTypes) {

	var Funcionario = sequelize.define('funcionarios', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [3, 100]}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {isEmail: true}
		}
	}, {
		classMethods: {
			All: function(t){
				return this.findAll({transaction: t});
			},
			Search: function(t, query){
				return this.findAll({ where: { nome: {
					$like: '%'+query+'%'
				} }, transaction: t});
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

	return Funcionario;
};
