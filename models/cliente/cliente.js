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
		uuid: {
			allowNull: false,
			type: DataTypes.STRING
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
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [6, 50],
					msg: "Senha deve conter pelo menos 6 caracteres"
				}
			}
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
			Create: function(cliente){
				return this.create(cliente);
			},
			Update: function(cliente){
				return this.find({ where: { id: cliente.id } }).then(function(entity) {
		      return entity.updateAttributes(cliente);
		    });
			}
		},
		paranoid: true
	});

	return Cliente;
};
