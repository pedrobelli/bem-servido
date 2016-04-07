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
	});

	return Servico;
};
