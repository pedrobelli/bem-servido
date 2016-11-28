module.exports = function(sequelize, DataTypes) {

  var Atendimento = sequelize.define('atendimentos', {
		nomeCliente: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [3, 50],
					msg: "Nome do cliente deve conter pelo menos 3 caracteres"
				}
			}
		},
    telefone: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [10, 11],
					msg: "Número de telefone deve conter 8 ou 9 dígitos"
				},
				is: {
					args: /^[0-9]*$/,
					msg: "Número de telefone deve conter apenas números"
				}
			}
		},
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
    },
    qualificado: {
      type: DataTypes.BOOLEAN
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
			},
			getByClientes: function(models, scopes, data, cliente){
				return this.scope(scopes).findAll({
          include: { model: models.profissionais, include: [
            { model: models.enderecos },
            { model: models.telefones }
          ] },
          where: [
            { clienteId: cliente },
            sequelize.where(sequelize.fn('date_format', sequelize.col('dataInicio'), '%d/%m/%Y'), 'LIKE', '%'+data+'%')
          ],
				  order: 'dataInicio ASC'
        });
			},
			getNotQualifiedByClientes: function(models, cliente){
				return this.findAll({
          include: [
            { model: models.detalhe_servicos, include: [ { model: models.servicos } ] },
            { model: models.profissionais }
          ],
          where: [
            { clienteId: cliente },
            { qualificado: false },
            { dataFim: {
                $lte: new Date(),
            } }
          ],
				  order: 'dataInicio ASC'
        });
			},
			getFromTodayByWeekday: function(weekday){
        var diaSemana = weekday == 7 ? 6 : weekday - 2

        return this.findAll({
          where: [
            { dataInicio: {
                $gte: new Date(),
            } },
            sequelize.where(sequelize.fn('weekday', sequelize.col('dataInicio')), '=', diaSemana)
          ]
        });
			},
			getFromTodayByWeekdayAndTime: function(horaTrabalho){
        var diaSemana = horaTrabalho.diaSemana == 7 ? 6 : horaTrabalho.diaSemana - 2;
        var horaInicio = new Date(horaTrabalho.horaInicio);
        var horaFim = new Date(horaTrabalho.horaFim);

				return this.findAll({
          where: sequelize.and(
            sequelize.where(sequelize.fn('weekday', sequelize.col('dataInicio')), '=', diaSemana),
            sequelize.or(
              sequelize.where(sequelize.fn('time', sequelize.col('dataInicio')), '<', sequelize.fn('time', horaInicio)),
              sequelize.where(sequelize.fn('time', sequelize.col('dataFim')), '>', sequelize.fn('time', horaFim))
            )
          )
        });
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
	    noServiceName: function (models, value) {
	      return {
					include: [ {
						model: models.detalhe_servicos, include: [ { model: models.servicos } ]
					} ]
	      }
	    },
	  },
		paranoid: true
	});

  return Atendimento
};
