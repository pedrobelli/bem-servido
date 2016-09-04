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
			Create: function(req){
				return this.create(req.body);
			},
			Update: function(req){
				return this.find({ where: { id: req.param('id') } }).then(function(entity) {
		      return entity.updateAttributes(req.body);
		    });
			}
		}
	});

  return Atendimento
};
