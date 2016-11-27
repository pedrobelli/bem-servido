define(['ko', 'text!qualificacaoModalTemplate', 'bridge'],
function(ko, template, bridge) {

  var viewModel = function(params) {
    var self = this;

    self.onSuccessCallback = ko.observable(function(){});
    self.nota = ko.observable(3);
    self.atendimento = ko.observable(3);
    self.profissional = ko.observable(3);
    self.cliente = ko.observable(3);
    self.avaliacao = ko.observable(3);

    self.showQualificacaoModal = function(dto, callback){
      cleanFields();

      $('#modal-qualificacao').openModal();

      self.atendimento(dto.atendimento);
      self.profissional(dto.profissional);
      self.cliente(dto.cliente);

      self.onSuccessCallback = callback;
    };

    self.salvar  = function() {
      console.log(self.nota());
    };

    var cleanFields = function() {
      self.nota(3);
      self.atendimento(undefined);
      self.profissional(undefined);
      self.cliente(undefined);
      self.avaliacao(undefined);
    };
  };

  var instance = new viewModel();

  ko.components.register('qualificacao-modal-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
