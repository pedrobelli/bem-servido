module.exports = function(sequelize, DataTypes) {

  var ProfissionalHabilidades = sequelize.define('profissional_habilidades', {
  }, {
    validate: {
	    RelationExists: function(callback) {
        sequelize.query(
          "SELECT * FROM profissional_habilidades WHERE profissionalId = ? AND habilidadeId = ?",
          { replacements: [this.profissionalId, this.habilidadeId], type: sequelize.QueryTypes.SELECT}
        ).then(function(response) {
          if (response.lenght > 0)
            callback(new Error("Este profissional já tem está habilidade cadastrada."));

          callback();
        });
	    }
	  },
		classMethods: {
			Destroy: function(habilidadeId, profissionalId){
				return this.find({ where: [
          { habilidadeId: habilidadeId },
          { profissionalId: profissionalId }
        ] }).then(function(entity) {
		      return entity.destroy();
		    });
			}
		}
  });

  return ProfissionalHabilidades
};
