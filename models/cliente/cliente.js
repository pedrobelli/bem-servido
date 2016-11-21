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
    dataNascimento: {
      allowNull: false,
      type: DataTypes.DATE
    },
		cpf: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [11],
					msg: "CPF deve conter 11 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "CPF deve conter apenas números"
				},
        isUnique: function(value, callback) {
					Cliente.find({ where: {cpf: value} })
          .then(function(response) {
            if (response)
							return callback(new Error('Já existe um cliente cadastrado com este CPF!'));

						return callback();
          });
        }
			}
		},
		sexo: {
			allowNull: true,
			type: DataTypes.INTEGER,
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
			},
			FindByUuid: function(uuids){
				return this.find({ where: { uuid: JSON.parse(uuids) }});
			}
		},
		paranoid: true
	});

	return Cliente;
};
