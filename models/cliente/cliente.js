module.exports = function(sequelize, DataTypes) {

	var Cliente = sequelize.define('clientes', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [3, 100]}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {isEmail: true}
		},
		telefone: {
			type: DataTypes.STRING,
			validate: {len: [11, 12]}
		},
		senha: {
			allowNull: false,
			type: DataTypes.STRING
		}
	});

	return Cliente;
};
