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
				return this.findAll({ where: { descricao: { $like: '%'+query+'%' } } });
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

	return Servico;
};
