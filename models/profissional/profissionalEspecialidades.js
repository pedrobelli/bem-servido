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
		classMethods: {
			Destroy: function(especialidadeId, profissionalId){
				return this.find({ where: [
          { especialidadeId: especialidadeId },
          { profissionalId: profissionalId }
        ] }).then(function(entity) {
		      return entity.destroy();
		    });
			}
		}
  });

  return ProfissionalEspecialidades
};
