module.exports = function(sequelize, DataTypes) {

  var Atendimento = sequelize.define('atendimentos', {
    valorTotal: {
      allowNull: false,
      type: DataTypes.DOUBLE,
			validate: {
        isFloat: {
          args: true,
          msg: "Valor deve ser monetário"
        }
      }
    },
    dataInicio: {
      allowNull: false,
      type: DataTypes.DATE
    },
    dataFim: {
      allowNull: false,
      type: DataTypes.DATE
    },
    duracao: {
      allowNull: true,
      type: DataTypes.DOUBLE,
			validate: {
        min: {
          args: 1,
          msg: "Duração deve ser maior ou igual 1 minuto"
        }
      }
    }
  }, {
		classMethods: {
			All: function(models){
				return this.findAll({ include: [
						 { model: models.clientes },
						 { model: models.profissionais }
					 ]
				});
			},
			Get: function(id){
				return this.find({ where: { id: id } });
			},
			Destroy: function(id){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(atendimento){
				return this.create(atendimento);
			},
			Update: function(atendimento){
				return this.find({ where: { id: atendimento.id } }).then(function(entity) {
		      return entity.updateAttributes(atendimento);
		    });
			}
		}
	});

  return Atendimento
};
