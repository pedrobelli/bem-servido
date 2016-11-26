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
		validate: {
	    horaFimBeforeHoraInicio: function() {
	      if (this.horaFim <= this.horaInicio)
	        throw new Error("O horario final de trabalho não pode ser anterior ou igual ao inicial");
	    }
	  },
		classMethods: {
			All: function(models){
				return this.findAll({ include: [ { model: models.servicos } ] });
			},
			Get: function(id){
				return this.find({ where: { id: id } });
			},
			Destroy: function(id){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(horaTrabalho){
				return this.create(horaTrabalho);
			},
			Update: function(horaTrabalho){
				return this.find({ where: { id: horaTrabalho.id } }).then(function(entity) {
		      return entity.updateAttributes(horaTrabalho);
		    });
			},
			FindByProfissional: function(models, profissionalId){
				return this.findAll({ where: { profissionalId: profissionalId } });
			}
		},
		paranoid: true,
		tableName: 'horas_trabalho'
	});

	return HoraTrabalho;
};
