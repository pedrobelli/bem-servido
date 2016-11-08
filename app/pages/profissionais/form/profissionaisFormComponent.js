define(['ko', 'text!profissionaisFormTemplate', 'jquery', 'bridge', 'swalComponentForm', 'dadosProfissionalComponent',
'dadosServicoComponent', 'dadosHorarioComponent'],
function(ko, template, $, bridge, swalComponent, dadosProfissionalComponent, dadosServicoComponent, dadosHorarioComponent) {

  var viewModel = function(params) {
    var self = this;

    self.textoProximo = ko.observable('PRÓXIMO');
    self.posicao = ko.observable(0);

    self.components = [dadosProfissionalComponent, dadosServicoComponent, dadosHorarioComponent];

    self.validForm = ko.pureComputed(function(){

      return true;
    });

    self.anterior = function(){
      var posicaoAtual = self.posicao();
      if (posicaoAtual == 0) {
        return;
      } else if (posicaoAtual == 1) {
        $('#anterior').fadeOut();
      } else if (posicaoAtual == 2) {
        self.textoProximo('PRÓXIMO');
      }

      self.posicao(posicaoAtual - 1);

      self.components[posicaoAtual].hide();
      self.components[self.posicao()].show();
    };

    self.proximo = function(){
      var posicaoAtual = self.posicao();
      if (posicaoAtual == 2) {
        return;
      } else if (posicaoAtual == 0) {
        $('#anterior').fadeIn();
      } else if (posicaoAtual == 1) {
        self.textoProximo('CONCLUIR');
      }

      self.posicao(posicaoAtual + 1);

      self.components[posicaoAtual].hide();
      self.components[self.posicao()].show();
    };

    var init = function(){
      setTimeout(function(){
        dadosProfissionalComponent.subscribe();
        dadosServicoComponent.subscribe();
        dadosHorarioComponent.subscribe();
      }, 500);
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
