module.exports = function(sequelize, DataTypes) {

	var Pessoa = sequelize.define('pessoas', {
		nome: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {len: [3, 100]}
		}
	});

	return Pessoa;
};
