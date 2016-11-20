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
    validate: {
	    timeBeginBeforeTimeEnd: function() {
	      if (this.dataFim <= this.dataInicio)
	        throw new Error("O horario final do agendamento não pode ser anterior ou igual ao inicial");
	    },
	    isProfessionalWorkingHour: function(callback) {
        var atendimento = this;
        var weekday = this.dataInicio.getDay() + 1;

        sequelize.query(
          "SELECT * FROM horas_trabalho WHERE profissionalId = ? AND diaSemana = ?",
          { replacements: [atendimento.profissionalId, weekday], type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.length == 0) {
            callback(new Error("Este profissional não trabalha no dia escolhido"));
          } else {
            var horaTrabalho = response[0];
            var horaInicio = new Date(Date.parse('11/11/1900 ' + (atendimento.dataInicio.getHours() - 2) + ':' + atendimento.dataInicio.getMinutes()));
            var horaFim = new Date(Date.parse('11/11/1900 ' + (atendimento.dataFim.getHours() - 2) + ':' + atendimento.dataFim.getMinutes()));

            if (horaInicio < horaTrabalho.horaInicio || horaFim > horaTrabalho.horaFim) {
              callback(new Error("Este profissional não trabalha no horário escolhido"));
            }

            callback();
          }
        });
	    },
	    professionalScheduleAvailable: function(callback) {
        sequelize.query(
          "SELECT * FROM atendimentos WHERE profissionalId = ? AND dataInicio < ? AND dataFim > ?",
          { replacements: [this.profissionalId, this.dataFim, this.dataInicio], type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.length > 0)
            callback(new Error("O horario selecionado para este profissional se encontra indisponível"));

          callback();
        });
	    },
	    clienteScheduleAvailable: function(callback) {
        sequelize.query(
          "SELECT * FROM atendimentos WHERE clienteId = ? AND dataInicio < ? AND dataFim > ?",
          { replacements: [this.clienteId, this.dataFim, this.dataInicio], type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.length > 0)
            callback(new Error("Já há um agendamento feito em sua agenda nesse horário"));

          callback();
        });
	    },
	    appointmentIsTodayOnwards: function() {
        var dataInicio = new Date(this.dataInicio);
        dataInicio = new Date(dataInicio.setHours(dataInicio.getHours() - 2));
        var today = new Date();
        today.setHours(-2,0,0,0);

        if (dataInicio < today)
	        throw new Error("Não é possível realizar agendamentos para datas passadas");
	    }
	  },
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
		},
		paranoid: true
	});

  return Atendimento
};
