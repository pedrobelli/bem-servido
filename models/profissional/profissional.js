module.exports = function(sequelize, DataTypes) {

	var Profissional = sequelize.define('profissionais', {
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
				return this.find({
					 include: [
						 { model: models.especialidades },
						 { model: models.servicos }
					 ],
					 where: { id: id }
				});
			},
			Destroy: function(id){
				return this.find({ where: { id: id }}).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(profissional){
				return this.create(profissional);
			},
			Update: function(profissional){
				return this.find({ where: { id: profissional.id } }).then(function(entity) {
		      return entity.updateAttributes(profissional);
		    });
			}
		}
	});

	return Profissional;
};
