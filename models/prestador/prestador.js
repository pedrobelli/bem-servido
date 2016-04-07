module.exports = function(sequelize, DataTypes) {

	var Prestador = sequelize.define('prestadores', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [3, 100]}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {isEmail: true}
		}
	});

	return Prestador;
};
