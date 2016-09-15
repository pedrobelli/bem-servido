module.exports = function(sequelize, DataTypes) {

	var Servico = sequelize.define('servicos', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
        len: {
          args: [3, 100],
          msg: "Nome deve conter pelo menos 3 caracters"
        }
      }
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
			Create: function(servico){
				servico.nome = servico.nome.charAt(0).toUpperCase() + servico.nome.slice(1).toLowerCase();
				return this.create(servico);
			},
			Update: function(servico){
				servico.nome = servico.nome.charAt(0).toUpperCase() + servico.nome.slice(1).toLowerCase();
				return this.find({ where: { id: servico.id } }).then(function(entity) {
		      return entity.updateAttributes(servico);
		    });
			},
			FindOrCreate: function(servico){
				return this.FindByNomeAndEspecialidade(servico).then(function(response) {
					if (response.length == 0) {
						return this.Create(servico).then(function(response) {
							return response
						});
					}
					return response[0];
				});
			},
			FindByNomeAndEspecialidade: function(servico){
				return this.findAll({ where: {
					nome: { $like: '%'+servico.nome+'%' },
					especialidadeId: servico.especialidadeId
				 } });
			}
		}
	});

	return Servico;
};
