module.exports = function(sequelize, DataTypes) {

	var FormaPagamento = sequelize.define('forma_pagamentos', {
		forma_pagamento: {
			type: DataTypes.INTEGER,
		}
	}, {
		classMethods: {
			All: function(){
				return this.findAll();
			},
			Get: function(models, id){
				return this.find({ where: { id: id } });
			},
			Destroy: function(id){
				return this.find({ where: { id: id }}).then(function(entity) {
		      return entity.destroy();
		    });
			},
			Create: function(formaPagamento){
				return this.create(formaPagamento);
			},
			Update: function(formaPagamento){
				return this.find({ where: { id: formaPagamento.id } }).then(function(entity) {
		      return entity.updateAttributes(formaPagamento);
		    });
			}
		},
		paranoid: true
	});

	return FormaPagamento;
};
