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
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 500],
          msg: "Descrição deve conter pelo menos 5 caracteres"
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
			Create: function(req){
				return this.create(req.body);
			},
			Update: function(req){
				return this.find({ where: { id: req.param('id') } }).then(function(entity) {
		      return entity.updateAttributes(req.body);
		    });
			},
			FindByServicos: function(models, servicoIds){
				return this.findAll({ include: [
          { model: models.servicos, where: { id: JSON.parse(servicoIds) } }
        ] })
			}
		}
  });

  return Especialidade
};
