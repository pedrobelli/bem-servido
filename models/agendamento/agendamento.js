module.exports = function(sequelize, DataTypes) {

  var Agendamento = sequelize.define('agendamentos', {
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
    },
    bloqueio: {
      type: DataTypes.BOOLEAN
    }
  }, {
    validate: {
	    timeBeginBeforeTimeEnd: function() {
	      if (this.dataFim <= this.dataInicio)
	        throw new Error("O horario final do agendamento não pode ser anterior ou igual ao inicial");
	    },
	    isProfessionalWorkingHour: function(callback) {
        var agendamento = this;
        var weekday = this.dataInicio.getDay() + 1;

        sequelize.query(
          "SELECT * FROM horas_trabalho WHERE profissionalId = ? AND diaSemana = ? AND deletedAt IS NULL",
          { replacements: [agendamento.profissionalId, weekday], type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.length == 0) {
            callback(new Error("Este profissional não trabalha no dia escolhido"));
          } else {
            var horaTrabalho = response[0];
            var dataInicio = new Date(Date.parse(
              '11/11/1900 ' + (agendamento.dataInicio.getHours() - 2) + ':' + agendamento.dataInicio.getMinutes())
            );
            var dataFim = new Date(Date.parse(
              '11/11/1900 ' + (agendamento.dataFim.getHours() - 2) + ':' + agendamento.dataFim.getMinutes())
            );

            if (dataInicio < horaTrabalho.horaInicio || dataFim > horaTrabalho.horaFim) {
              callback(new Error("Este profissional não trabalha no horário escolhido"));
            }

            callback();
          }
        });
	    },
	    professionalScheduleAvailable: function(callback) {
        var dataInicio = new Date(Date.parse(
          (this.dataInicio.getMonth()+1) + '/' + this.dataInicio.getDate() + '/' + this.dataInicio.getFullYear() +
          ' ' + (this.dataInicio.getHours()) + ':' + this.dataInicio.getMinutes())
        );
        var dataFim = new Date(Date.parse(
          (this.dataFim.getMonth()+1) + '/' + this.dataFim.getDate() + '/' + this.dataFim.getFullYear() +
          ' ' + (this.dataFim.getHours()) + ':' + this.dataFim.getMinutes())
        );

        var sql = "SELECT * FROM agendamentos WHERE id != ? AND profissionalId = ? AND dataInicio < ? AND dataFim > ? AND deletedAt IS NULL";
        var replacements = [this.id, this.profissionalId, dataFim, dataInicio];

        if (!this.id) {
          sql = "SELECT * FROM agendamentos WHERE profissionalId = ? AND dataInicio < ? AND dataFim > ? AND deletedAt IS NULL";
          replacements.shift();
        }

        sequelize.query(
          sql,
          { replacements: replacements, type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.length > 0)
            callback(new Error("O horario selecionado para este profissional se encontra indisponível"));

          callback();
        });
	    },
	    clienteScheduleAvailable: function(callback) {
        var dataInicio = new Date(Date.parse(
          (this.dataInicio.getMonth()+1) + '/' + this.dataInicio.getDate() + '/' + this.dataInicio.getFullYear() +
          ' ' + (this.dataInicio.getHours()) + ':' + this.dataInicio.getMinutes())
        );
        var dataFim = new Date(Date.parse(
          (this.dataFim.getMonth()+1) + '/' + this.dataFim.getDate() + '/' + this.dataFim.getFullYear() +
          ' ' + (this.dataFim.getHours()) + ':' + this.dataFim.getMinutes())
        );

        var sql = "SELECT * FROM agendamentos WHERE id != ? AND clienteId = ? AND dataInicio < ? AND dataFim > ? AND deletedAt IS NULL";
        var replacements = [this.id, this.clienteId, dataFim, dataInicio];

        if (!this.id) {
          sql = "SELECT * FROM agendamentos WHERE clienteId = ? AND dataInicio < ? AND dataFim > ? AND deletedAt IS NULL";
          replacements.shift();
        }

        sequelize.query(
          sql,
          { replacements: replacements, type: sequelize.QueryTypes.SELECT}
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
			Get: function(models, id){
				return this.find({
          include: [
            { model: models.clientes, include: [
              { model: models.telefones },
            ] },
            { model: models.detalhe_servicos, include: [ { model: models.servicos } ] }
          ],
          where: { id: id }
        });
			},
			Destroy: function(id){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(agendamento){
				return this.create(agendamento);
			},
			Update: function(agendamento){
				return this.find({ where: { id: agendamento.id } }).then(function(entity) {
		      return entity.updateAttributes(agendamento);
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
			getByAno: function(ano){
				return this.scope(scopes).findAll({
          attributes: { include: [
						[ sequelize.fn('month', sequelize.col('dataInicio')), 'mes' ],
						[ sequelize.fn('sum', sequelize.literal('qualificado = 1')), 'qualificados' ],
						[ sequelize.fn('sum', sequelize.literal('deletedAt IS NOT NULL')), 'cancelados' ],
						[ sequelize.fn('count', sequelize.literal('*')), 'totalAgendamentos' ]
					] },
          where: [
            { bloqueio: false },
            sequelize.where(sequelize.fn('year', sequelize.col('dataInicio')), '=', ano)
          ],
          group: [ [sequelize.literal('mes')] ],
				  order: [ [sequelize.literal('mes ASC')] ],
          paranoid: false
        });
			},
			getByDateInterval: function(dataInicio, dataFim){
				return this.scope(scopes).findAll({
          where: [
            { dataInicio: {
                $gte: dataInicio,
            } },
            { dataFim: {
                $lte: dataFim,
            } }
          ],
				  order: [ [sequelize.literal('dataInicio ASC')] ],
          paranoid: false
        });
			},
			getByDateIntervalFilterByYear: function(dataInicio, dataFim){
				return this.scope(scopes).findAll({
          attributes: { include: [
						[ sequelize.fn('month', sequelize.col('dataInicio')), 'mes' ],
						[ sequelize.fn('year', sequelize.col('dataInicio')), 'ano' ],
						[ sequelize.fn('sum', sequelize.literal('qualificado = 1')), 'qualificados' ],
						[ sequelize.fn('sum', sequelize.literal('deletedAt IS NOT NULL')), 'cancelados' ],
						[ sequelize.fn('count', sequelize.literal('*')), 'totalAgendamentos' ]
					] },
          where: [
            { dataInicio: {
                $gte: dataInicio,
            } },
            { dataFim: {
                $lte: dataFim,
            } }
          ],
          group: [ [sequelize.literal('ano, mes')] ],
				  order: [ [sequelize.literal('ano, mes')] ],
          paranoid: false
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

  return Agendamento
};
