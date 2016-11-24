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
        especialidade.nome = especialidade.nome.charAt(0).toUpperCase() + especialidade.nome.slice(1).toLowerCase();
				return this.create(especialidade);
			},
			Update: function(especialidade){
        especialidade.nome = especialidade.nome.charAt(0).toUpperCase() + especialidade.nome.slice(1).toLowerCase();
				return this.find({ where: { id: especialidade.id } }).then(function(entity) {
		      return entity.updateAttributes(especialidade);
		    });
			},
			FindOrCreate: function(especialidade){
				return this.FindByNomeAndRamo(especialidade).then(function(response) {
					if (!response) {
						return this.Create(especialidade).then(function(response) {
							return response
						});
					}
					return response;
				});
			},
			FindByNomeAndRamo: function(especialidade){
				return this.find({ where: {
					nome: especialidade.nome,
					ramo: especialidade.ramo
				 } });
			},
			FindByServicos: function(models, servicoIds){
				return this.findAll({ include: [
          { model: models.servicos, where: { id: JSON.parse(servicoIds) } }
        ] });
			},
			FindByProfissional: function(models, profissionalId){
				return this.findAll({ include: [
          { model: models.profissionais, required: true, through: { where: { profissionalId: profissionalId } } }
        ] });
			},
			FindSeededByRamo: function(models, ramoId){
				return this.findAll({
					include: [ { model: models.servicos, where: { seed: true } } ],
					where: { ramo: ramoId, seed: true }
        });
			}
		},
		paranoid: true
  });

  return Especialidade
};
