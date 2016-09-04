define(['ko', 'text!./profissionaisTemplate.html', 'bridge', 'jquery', 'materialize', '../shared/search/searchComponent', '../shared/swal/swalComponent'],
function(ko, template, bridge, $, materialize, searchComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.profissionais = ko.observableArray([]);

    searchComponent.subscribe("/api/profissionais/query", function(response){
      mapResponseToProfissionais(response.profissionais);
    });

    self.exclude = function(profissional){
      var errorTitle = 'Não foi possível excluir funcionário';
      swalComponent.removeInstanceWarning("/api/profissionais/" + profissional.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToProfissionais = function(profissionais){
      if(!profissionais) return self.profissionais([]);
      var profissionais = profissionais.map(function(profissional){
        return {
          id    : profissional.id,
          nome  : profissional.nome,
          email : profissional.email
        };
      });

      self.profissionais(profissionais);
    };

    var init = function(){
      bridge.get("/api/profissionais")
      .then(function(response){
        mapResponseToProfissionais(response.profissionais);
        searchComponent.setPlaceholderText(response.placeholderOptions);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Profissionais"
    }
  };
});
