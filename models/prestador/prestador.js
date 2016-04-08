module.exports = function(sequelize, DataTypes) {

	var Prestador = sequelize.define('prestadores', {
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

	return Prestador;
};
