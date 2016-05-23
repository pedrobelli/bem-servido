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
			All: function(){
				return this.findAll();
			},
			Get: function(id){
				return this.find({ where: { id: id } });
			},
			Destroy: function(id){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(req){
				return this.create(req.body);
			},
			Update: function(req){
				return this.find({ where: { id: req.param('id') } }).then(function(entity) {
		      return entity.updateAttributes(req.body);
		    });
			}
		}
	});

	return Cliente;
};
