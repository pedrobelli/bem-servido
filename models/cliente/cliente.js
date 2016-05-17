module.exports = function(sequelize, DataTypes) {

	var Cliente = sequelize.define('clientes', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [3, 50],
					msg: "Nome deve conter pelo menos 3 caracteres"
				}
			}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				isEmail: {
					args: true,
					msg: "Email inválido"
				}
			}
		},
		telefone: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [10, 11],
					msg: "Número de telefone deve conter 8 ou 9 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "Número de telefone deve conter apenas números"
				}
			}
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
