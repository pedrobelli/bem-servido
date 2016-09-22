module.exports = function(sequelize, DataTypes) {

	var Profissional = sequelize.define('profissionais', {
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
    dataNascimento: {
      allowNull: false,
      type: DataTypes.DATE
    },
		sexo: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		cpf: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [11],
					msg: "CPF deve conter 11 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "CPF deve conter apenas números"
				}
			}
		},
		cnpj: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [14],
					msg: "CNPJ deve conter 14 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "CNPJ deve conter apenas números"
				}
			}
		}
	}, {
		classMethods: {
			All: function(){
				return this.findAll();
			},
			Search: function(query){
				return this.findAll({ where: { nome: { $like: '%'+query+'%' } } });
			},
			Get: function(models, id){
				return this.find({
					 include: [
						 { model: models.especialidades },
						 { model: models.servicos }
					 ],
					 where: { id: id }
				});
			},
			Destroy: function(id){
				return this.find({ where: { id: id }}).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(profissional){
				return this.create(profissional);
			},
			Update: function(profissional){
				return this.find({ where: { id: profissional.id } }).then(function(entity) {
		      return entity.updateAttributes(profissional);
		    });
			}
		}
	});

	return Profissional;
};
