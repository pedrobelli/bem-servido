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
        isFloat: {
          args: true,
          msg: "Duração deve ser inteiro"
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
			Create: function(detalheServico){
				return this.create(detalheServico);
			},
			Update: function(id, detalheServico){
				return this.find({ where: { id: id } }).then(function(entity) {
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
