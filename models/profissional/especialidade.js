module.exports = function(sequelize, DataTypes) {

  var Especialidade = sequelize.define('especialidades', {
    nome: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 50],
          msg: "Nome deve conter pelo menos 3 caracteres"
        }
      }
    },
    descricao: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 500],
          msg: "Descrição deve conter pelo menos 5 caracteres"
        }
      }
    },
    ramo: {
			allowNull: false,
			type: DataTypes.INTEGER,
			validate: {
        isInt: {
          args: true,
          msg: "Ramo deve ser preenchido"
        }
      }
    },
    seed: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    }
  }, {
		classMethods: {
			All: function(){
				return this.findAll();
			},
			Search: function(query){
				return this.findAll({ where: { nome: { $like: '%'+query+'%' } } });
			},
			Get: function(id){
				return this.find({ where: { id: id } });
			},
			Destroy: function(id){
				return this.find({ where: { id: id } }).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(especialidade){
				return this.create(especialidade);
			},
			Update: function(especialidade){
				return this.find({ where: { id: especialidade.id } }).then(function(entity) {
		      return entity.updateAttributes(especialidade);
		    });
			},
			FindByServicos: function(models, servicoIds){
				return this.findAll({ include: [
          { model: models.servicos, where: { id: JSON.parse(servicoIds) } }
        ] });
			}
		}
  });

  return Especialidade
};
