module.exports = function(sequelize, DataTypes) {

	var DetalheServico = sequelize.define('detalhe_servicos', {
		valor: {
			allowNull: false,
			type: DataTypes.DOUBLE,
			validate: {
        isFloat: {
          args: true,
          msg: "Valor deve ser monetário"
        }
      }
		},
		duracao: {
			allowNull: false,
			type: DataTypes.INTEGER,
			validate: {
        isInt: {
          args: true,
          msg: "Duração deve ser inteiro"
        }
      }
		}
	}, {
		classMethods: {
			All: function(models){
				return this.findAll({ include: [ { model: models.servicos } ] });
			},
			Search: function(models, query){
				return this.findAll({ include: [
          { model: models.servicos, where: { nome: { $like: '%'+query+'%' } } }
        ] });
			},
			Get: function(models, id){
				return this.find({
					include: [ { model: models.servicos } ],
					where: { id: id },
			  });
			},
			Destroy: function(id){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(detalheServico){
				return this.create(detalheServico);
			},
			Update: function(detalheServico){
				return this.find({ where: { id: detalheServico.id } }).then(function(entity) {
		      return entity.updateAttributes(detalheServico);
		    });
			},
			FindOrCreate: function(detalheServico){
				return this.FindByValorDuracaoEspecialidadeAndServico(detalheServico).then(function(response) {
					if (response.length == 0) {
						return this.Create(detalheServico).then(function(response) {
							return response
						});
					}
					return response[0];
				});
			},
			FindByValorDuracaoEspecialidadeAndServico: function(detalheServico){
				return this.findAll({ where: {
					valor: detalheServico.valor ,
					duracao: detalheServico.duracao,
					servicoId: detalheServico.servicoId
				 } });
			}
		}
	});

	return DetalheServico;
};
