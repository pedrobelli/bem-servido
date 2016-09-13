module.exports = function(sequelize, DataTypes) {

	var EspecializacaoServico = sequelize.define('especializacoes_servico', {
		descricao: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
        len: {
          args: [5, 100],
          msg: "Descrição deve conter pelo menos 5 caracters"
        }
      }
		},
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
          msg: "Valor deve ser inteiro"
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
			Create: function(servico){
				return this.create(servico);
			},
			Update: function(id, servico){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.updateAttributes(servico);
		    });
			}
		}
	});

	return EspecializacaoServico;
};
