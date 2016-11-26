define(['ko', 'text!formDadosTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm', 'datepickerComponent', 'momentComponent'],
function(ko, template, $, bridge, maskComponent, swalComponent, datepickerComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    var formOptionsRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/form_options" : "/api/profissionais/form_options";
    var getRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/get/" + localStorage.getItem('current_user_id') : "/api/profissionais/get/" + localStorage.getItem('current_user_id');
    var updateRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/edit" : "/api/profissionais/edit";
    var route = localStorage.getItem('current_user_role') == 1 ? "#clientes/perfil" : "#profissionais/perfil";

    self.nomeCompleto = ko.observable();
    self.dataNascimento = ko.observable();
    self.sexo = ko.observable();
    self.cpf = ko.observable();
    self.cpfCnpj = ko.observable();
    self.cliente = ko.observable(localStorage.getItem('current_user_role') == 1 ? true : false);

    // telefones
    self.telefoneId = ko.observable();
    self.telefone = ko.observable();
    self.celular = ko.observable();

    self.sexos = ko.observableArray([]);

    self.errorTitle = "Ocorreu um erro na atualização de seus dados!";

    self.cancelar = function(){
      return window.location.hash = route;
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
        return window.location.hash = route;
      });

    };

    var validate = function(){
      var errors = []
      valid = !!self.nomeCompleto();
      valid = valid && !!self.dataNascimento();

      if(localStorage.getItem('current_user_role') == 1) valid = valid && !!self.cpf();;
      if(localStorage.getItem('current_user_role') == 2) valid = valid && !!self.cpfCnpj();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com a edição de seus dados.");
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
        cpf_cnpj       : self.cpfCnpj(),
        telefoneId     : self.telefoneId(),
        telefone       : !!self.telefone() ? self.telefone() : undefined,
        celular        : !!self.celular() ? self.celular() : undefined,
      };

      if (localStorage.getItem('current_user_role') == 1) payload.clienteId = payload.id;
      if (localStorage.getItem('current_user_role') == 2) payload.pofissionalId = payload.id;

      return payload;
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

      maskComponent.applyCPFMask();
      maskComponent.applyCPF_CNPJMask();
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
          var usuario = !!response.cliente ? response.cliente : response.profissional;
          self.nomeCompleto(usuario.nome);
          self.sexo(!!usuario.sexo ? usuario.sexo : undefined);
          self.dataNascimento(momentComponent.convertDateToString(momentComponent.convertDateStringToDate(usuario.dataNascimento)));
          self.telefoneId(usuario.telefone.id);
          self.telefone(usuario.telefone.telefone);
          self.celular(usuario.telefone.celular);

          if(localStorage.getItem('current_user_role') == 1) self.cpf(usuario.cpf);
          if(localStorage.getItem('current_user_role') == 2) self.cpfCnpj(usuario.cpf_cnpj);
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
