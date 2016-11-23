define(['ko', 'text!formDadosTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm', 'datepickerComponent', 'momentComponent'],
function(ko, template, $, bridge, maskComponent, swalComponent, datepickerComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    var formOptionsRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/form_options" : "/api/profissionais/form_options";
    var getRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/get/" + localStorage.getItem('current_user_id') : "/api/profissionais/get/" + localStorage.getItem('current_user_id');
    var updateRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/edit" : "/api/profissionais/edit";

    self.nomeCompleto = ko.observable();
    self.dataNascimento = ko.observable();
    self.sexo = ko.observable();
    self.cpf = ko.observable();

    // telefones
    self.telefoneId = ko.observable();
    self.telefone = ko.observable();
    self.celular = ko.observable();

    self.sexos = ko.observableArray([]);

    self.errorTitle = "Ocorreu um erro na atualização de seus dados!";

    self.cancelar = function(){
      return window.location.hash = "#clientes/perfil";
    };

    self.salvar = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post(updateRoute, generatePayload())
      .fail(function(context, errorMessage, serverError){
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
      })
      .done(function(response){
        var nome = !!response.cliente ? response.cliente.nome : response.profissional.nome;
        localStorage.setItem('current_user_name', nome);
        return window.location.hash = "#clientes/perfil";
      });

    };

    var validate = function(){
      var errors = []
      valid = !!self.nomeCompleto();
      valid = valid && !!self.cpf();
      valid = valid && !!self.dataNascimento();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com a edição de seus dados.")
      }

      return errors;
    };

    var generatePayload = function(){
      var payload = {
        id             : localStorage.getItem('current_user_id'),
        nome           : self.nomeCompleto(),
        dataNascimento : momentComponent.convertStringToDate(self.dataNascimento()),
        sexo           : !!self.sexo() ? self.sexo() : 0,
        cpf            : self.cpf(),
        telefoneId     : self.telefoneId(),
        telefone       : self.telefone(),
        celular        : self.celular(),
      };

      if (localStorage.getItem('current_user_role') == 1) payload.clienteId = payload.id;
      if (localStorage.getItem('current_user_role') == 2) payload.pofissionalId = payload.id;

      return payload;
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

      maskComponent.applyCPFMask();
      maskComponent.applyCelphoneMask();

      bridge.get(formOptionsRoute)
      .then(function(response){
        var sexos = response.sexos.map(function(sexo){
          return {
            id   : sexo.id,
            text : sexo.text
          }
        });

        self.sexos(sexos);
      })
      .then(function(){
        return bridge.get(getRoute)
        .then(function(response){
          self.nomeCompleto(response.cliente.nome);
          self.cpf(response.cliente.cpf);
          self.sexo(!!response.cliente.sexo ? response.cliente.sexo : undefined);
          self.dataNascimento(momentComponent.convertDateToString(momentComponent.convertDateStringToDate(response.cliente.dataNascimento)));
          self.telefoneId(response.cliente.telefone.id);
          self.telefone(response.cliente.telefone.telefone);
          self.celular(response.cliente.telefone.celular);
        });
      })
      .then(function(){
        $('select').material_select();
      });
    };

    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Atualizar dados"
    }
  };
});
