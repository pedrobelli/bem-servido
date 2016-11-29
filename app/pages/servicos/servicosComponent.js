define(['ko', 'text!servicosTemplate', 'bridge', 'jquery', 'swalComponent', 'maskComponent'],
function(ko, template, bridge, $, swalComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.detalheServicos = ko.observableArray([]);
    self.hasResult = ko.observable(false);

    self.exclude = function(detalheServico){
      var errorTitle = 'Não foi possível excluir serviço';
      swalComponent.removeInstanceWarning("/api/detalhe_servicos/" + detalheServico.id, errorTitle, function(){
        init();
      });
    };

    var mapResponseToServicos = function(detalheServicos){
      if(!detalheServicos.length) {
        self.hasResult(true);
        return self.detalheServicos([]);
      }

      self.hasResult(false);
      var detalheServicos = detalheServicos.map(function(detalheServico){
        return {
          id      : detalheServico.id,
          nome    : detalheServico.servico.nome,
          valor   : maskComponent.accountingFormat(detalheServico.valor),
          duracao : detalheServico.duracao
        };
      });

      self.detalheServicos(detalheServicos);
    };

    var init = function(){
      bridge.post("/api/detalhe_servicos/by_profissional", { profissional : localStorage.getItem('current_user_id') })
      .then(function(response){
        mapResponseToServicos(response.detalheServicos);
      });
    };

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Serviços"
    }
  };
});
