module.exports = function(sequelize, DataTypes) {

	var Telefone = sequelize.define('telefones', {
		residencial: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [10, 11],
					msg: "Número de telefone residencial deve conter 8 ou 9 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "Número de telefone residencial deve conter apenas números"
				}
			}
		},
		celular: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [10, 11],
					msg: "Número de telefone celular deve conter 8 ou 9 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "Número de telefone celular deve conter apenas números"
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
			Create: function(telefone){
				return this.create(telefone);
			},
			Update: function(telefone){
				return this.find({ where: { id: telefone.id } }).then(function(entity) {
		      return entity.updateAttributes(telefone);
		    });
			}
		}
	});

	return Telefone;
};
