module.exports = function(sequelize, DataTypes) {

	var Telefone = sequelize.define('telefones', {
		telefone: {
			type: DataTypes.STRING,
			validate: {
				is: {
					args: /^[0-9]*$/,
					msg: "Número de telefone residencial deve conter apenas números"
				},
        length: function(value) {
					if (value.length != 0 && (value.length < 10 || value.length > 11))
						throw new Error('Número de telefone residencial deve conter 8 ou 9 dígitos')
        }
			}
		},
		celular: {
			type: DataTypes.STRING,
			validate: {
				is: {
					args: /^[0-9]*$/,
					msg: "Número de telefone celular deve conter apenas números"
				},
        length: function(value) {
					if (value.length != 0 && (value.length < 10 || value.length > 11))
						throw new Error('Número de telefone celular deve conter 8 ou 9 dígitos')
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
		},
		paranoid: true
	});

	return Telefone;
};
