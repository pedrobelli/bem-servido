define(['ko', 'text!qualificacaoModalTemplate', 'bridge', 'swalComponent'],
function(ko, template, bridge, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    self.onSuccessCallback = ko.observable(function(){});
    self.nota = ko.observable(3);
    self.notaText = ko.observable(3);
    self.atendimento = ko.observable();
    self.profissional = ko.observable();
    self.cliente = ko.observable();
    self.avaliacao = ko.observable();

    self.loadValorEDuracao = ko.computed(function(){
      if (!!self.nota()) {
        self.notaText(self.nota());
      }
    });

    self.showQualificacaoModal = function(dto, callback){
      cleanFields();

      $('#modal-qualificacao').openModal();

      self.atendimento(dto.atendimento);
      self.profissional(dto.profissional);
      self.cliente(dto.cliente);

      self.onSuccessCallback = callback;
    };

    self.salvar  = function() {
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post("/api/qualificacoes/new", generatePayload())
      .fail(function(context, errorMessage, serverError) {
        swalComponent.errorAlertWithTitle("Não foi possível realizar a qualificação", context.errors);
      }).done(function() {
        $('#modal-qualificacao').closeModal();
        self.onSuccessCallback();
      });
    };

    var generatePayload = function(){
      var payload = {
        nota           : self.nota(),
        avaliacao      : self.avaliacao(),
        atendimentoId  : self.atendimento(),
        profissionalId : self.profissional(),
        clienteId      : self.cliente()
      };

      return payload;
    };

    var validate = function() {
      var errors = []
      valid = !!self.nota();
      valid = valid && !!self.atendimento();
      valid = valid && !!self.profissional();
      valid = valid && !!self.cliente();
      valid = valid && !!self.avaliacao();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para concluir sua qualificação.")
      }

      return errors;
    };

    var cleanFields = function() {
      self.nota(3);
      self.notaText(3);
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
