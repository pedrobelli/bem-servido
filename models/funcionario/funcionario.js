module.exports = function(sequelize, DataTypes) {

	var Funcionario = sequelize.define('funcionarios', {
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
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				isEmail: {
					args: true,
					msg: "Email inválido"
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
			Get: function(models, id){
				return this.find({ where: { id: id },
					 include: [
						 { model: models.especialidades },
						 { model: models.servicos }
					 ]
				});
			},
			Destroy: function(id){
				return this.find({ where: { id: id }}).then(function(entity) {
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
			}
		}
	});

	return Funcionario;
};
