module.exports = function(sequelize, DataTypes) {

	var HoraTrabalho = sequelize.define('horas_trabalho', {
		diaSemana: {
			allowNull: false,
			type: DataTypes.INTEGER
		},
		horaInicio: {
			allowNull: false,
			type: DataTypes.DATE
		},
		horaFim: {
			allowNull: false,
			type: DataTypes.DATE
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
			}
		},
		paranoid: true,
		tableName: 'horas_trabalho'
	});

	return HoraTrabalho;
};
