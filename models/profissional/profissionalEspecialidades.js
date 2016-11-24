module.exports = function(sequelize, DataTypes) {

  var ProfissionalEspecialidades = sequelize.define('profissional_especialidades', {
  }, {
    validate: {
	    RelationExists: function(callback) {
        sequelize.query(
          "SELECT * FROM profissional_especialidades WHERE profissionalId = ? AND especialidadeId = ?",
          { replacements: [this.profissionalId, this.especialidadeId], type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.lenght > 0)
            callback(new Error("Este profissional já tem está habilidade cadastrada."));

          callback();
        });
	    }
	  },
		paranoid: true
  });

  return ProfissionalEspecialidades
};
