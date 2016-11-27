module.exports = function(sequelize, DataTypes) {

	var Qualificacao = sequelize.define('qualificacoes', {
		nota: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		avaliacao: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [3, 100],
					msg: "Avaliacao deve conter pelo menos 3 caracteres"
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
			Create: function(qualificacao){
				return this.create(qualificacao);
			},
			Update: function(qualificacao){
				return this.find({ where: { id: qualificacao.id } }).then(function(entity) {
		      return entity.updateAttributes(qualificacao);
		    });
			}
		},
		paranoid: true,
		tableName: 'qualificacoes'
	});

	return Qualificacao;
};
