module.exports = function(sequelize, DataTypes) {

	var Servico = sequelize.define('servicos', {
		descricao: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [5, 100]}
		},
		valor: {
			allowNull: false,
			type: DataTypes.DOUBLE,
			validate: {isFloat: true}
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

	return Servico;
};
