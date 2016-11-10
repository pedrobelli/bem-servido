define(['ko', 'text!profissionaisFormTemplate', 'jquery', 'bridge', 'swalComponentForm', 'dadosProfissionalComponent',
'dadosServicoComponent', 'dadosHorarioComponent'],
function(ko, template, $, bridge, swalComponent, dadosProfissionalComponent, dadosServicoComponent, dadosHorarioComponent) {

  var viewModel = function(params) {
    var self = this;

    self.textoProximo = ko.observable('PRÓXIMO');
    self.posicao = 0;

    self.components = [dadosProfissionalComponent, dadosServicoComponent, dadosHorarioComponent];

    self.components.forEach(function(component){
      component.cleanFields();
    });

    self.anterior = function(){
      var posicaoAtual = self.posicao;
      if (posicaoAtual == 0) {
        return;
      } else if (posicaoAtual == 1) {
        $('#anterior').fadeOut();
      } else if (posicaoAtual == 2) {
        self.textoProximo('PRÓXIMO');
      }

      self.posicao = posicaoAtual - 1;

      self.components[posicaoAtual].hide();
      self.components[self.posicao].show();
    };

    self.proximo = function(){
      var errors = [];
      for (var i = self.posicao; i >= 0; i--) {
        errors = errors.concat(self.components[i].validate());
      }

      if (errors.length > 0) {
        var errorTitle = "Corrija os erros em seu cadastro!";
        errors = _.uniq(errors);
        swalComponent.simpleErrorAlertWithTitle(errorTitle, errors);
        return;
      }

      var posicaoAtual = self.posicao;
      if (posicaoAtual == 2) {
        var payload = {};
        self.components.forEach(function(component){
          payload = component.generatePayload(payload);
        });

        console.log(payload);

        return;
      } else if (posicaoAtual == 0) {
        $('#anterior').fadeIn();
      } else if (posicaoAtual == 1) {
        self.textoProximo('CONCLUIR');
      }

      self.posicao = posicaoAtual + 1;

      self.components[posicaoAtual].hide();
      self.components[self.posicao].show();
    };

    var init = function(){
      bridge.get("/api/profissionais/form_options")
      .then(function(response){
        self.components.forEach(function(component){
          component.mapResponse(response);
        });
      })
      .then(function(){
        self.components.forEach(function(component){
          component.subscribe();
        });
      });
    };

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Cadastro de Profissional"
    }
  };
});
