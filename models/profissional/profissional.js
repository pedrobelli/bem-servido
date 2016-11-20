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
		uuid: {
			allowNull: false,
			type: DataTypes.STRING
		},
    dataNascimento: {
      allowNull: false,
      type: DataTypes.DATE
    },
		cpf_cnpj: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [11, 14],
					msg: "CPF deve conter 11 dígitos/CNPJ deve conter 14 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "CPF/CNPJ deve conter apenas números"
				},
        isUnique: function(value, callback) {
					Profissional.find({ where: {cpf_cnpj: value} })
          .then(function(response) {
            if (response.length > 0)
							return callback(new Error('Já existe um profissional cadastrado com este CPF/CNPJ!'));

						return callback();
          });
        }
			}
		},
    ramo: {
			allowNull: false,
			type: DataTypes.INTEGER,
			validate: {
        isInt: {
          args: true,
          msg: "Ramo deve ser preenchido"
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
			// Search: function(query){
			// 	return this.findAll({ where: { nome: { $like: '%'+query+'%' } } });
			// },
			Get: function(models, id){
				return this.find({
					 include: [
						 { model: models.especialidades },
						 { model: models.detalhe_servicos, include: [ { model: models.servicos } ] },
						 { model: models.horas_trabalho }
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
			},
			FindByUuid: function(uuids){
				return this.find({ where: { uuid: JSON.parse(uuids) }});
			},
			Search: function(scopes){
				return this.scope(scopes).findAll({ order: [ [sequelize.fn('RAND')] ] });
			}
		},
		scopes: {
	    byServiceName: function (models, value) {
	      return {
					include: [ {
						model: models.detalhe_servicos, include: [ {
							model: models.servicos, where: { nome: { $like: '%'+value+'%' } }
						} ]
					} ]
	      }
	    },
	    byCidade: function (models, value) {
	      return {
					include: [ {
						model: models.enderecos, where: { cidade: { $like: '%'+value+'%' } }
					} ]
	      }
	    },
	    byDiaSemana: function (models, value) {
	      return {
					include: [ {
						model: models.horas_trabalho, where: { diaSemana: value }
					} ]
	      }
	    }
	  },
		paranoid: true
	});

	return Profissional;
};
