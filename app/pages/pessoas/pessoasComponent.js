define(['ko', 'text!./pessoasTemplate.html', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    self.pessoas = ko.observableArray([]);

    self.exclude = function(pessoas){
      bridge.del("/api/pessoas/"+pessoas.id)
      .then(function(response){
        init();
      });
    };

    var mapResponseToPessoas = function(pessoas){
      if(!pessoas) return self.pessoas([]);
      var pessoas = pessoas.map(function(pessoa){
        return {
          id   : pessoa.id,
          nome : pessoa.nome
        };
      });

      self.pessoas(pessoas);
    };

    var init = function(){
      bridge.get("/api/pessoas")
      .then(function(response){
        mapResponseToPessoas(response.pessoas);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Pessoas"
    }
  };
});
