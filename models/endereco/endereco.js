module.exports = function(sequelize, DataTypes) {

	var Endereco = sequelize.define('enderecos', {
		cep: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [8],
					msg: "CEP deve conter apenas 8 dígitos"
				}
			}
		},
		rua: {
			type: DataTypes.STRING
		},
		num: {
			type: DataTypes.STRING
		},
		complemento: {
			type: DataTypes.STRING
		},
		bairro: {
			type: DataTypes.STRING
		},
		cidade: {
			type: DataTypes.STRING
		},
		estado: {
			type: DataTypes.INTEGER
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
			Create: function(endereco){
				return this.create(endereco);
			},
			Update: function(endereco){
				return this.find({ where: { id: endereco.id } }).then(function(entity) {
		      return entity.updateAttributes(endereco);
		    });
			}
		}
	});

	return Endereco;
};
