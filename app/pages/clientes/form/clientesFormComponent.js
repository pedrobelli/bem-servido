define(['ko', 'text!clientesFormTemplate', 'jquery', 'bridge', 'auth0', 'maskComponentForm', 'swalComponentForm',
'datepickerComponent', 'momentComponent'],
function(ko, template, $, bridge, auth0, maskComponent, swalComponent, datepickerComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = new auth0({
      domain: 'pedrobelli.auth0.com',
      clientID: 'hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM'
    });

    self.nomeCompleto = ko.observable();
    self.dataNascimento = ko.observable();
    self.sexo = ko.observable();
    self.cpf = ko.observable();

    // telefones
    self.telefone = ko.observable();
    self.celular = ko.observable();

    // endereco
    self.endereco_rua = ko.observable();
    self.endereco_num   = ko.observable();
    self.endereco_comp = ko.observable();
    self.endereco_bairro = ko.observable();
    self.endereco_cep = ko.observable();
    self.endereco_cidade = ko.observable();
    self.endereco_estado = ko.observable();

    // usuario
    self.email = ko.observable();
    self.password = ko.observable();
    self.confirmPassword = ko.observable();

    self.sexos = ko.observableArray([]);
    self.estados = ko.observableArray([]);

    self.errorTitle = "Ocorreu um erro em seu cadastro!";

    self.loadEndereco = ko.computed(function(){
      if (!!self.endereco_cep() && self.endereco_cep().length == 8) {
        bridge.get("http://api.postmon.com.br/v1/cep/"+self.endereco_cep())
        .then(function(response){
          self.endereco_rua(response.logradouro);
          self.endereco_bairro(response.bairro);
          self.endereco_cidade(response.cidade);
          self.endereco_estado(response.estado_info.codigo_ibge);
        })
        .then(function(){
          $('select').material_select();
        });
      }

    });

    self.validate = function(){
      var errors = []
      valid = !!self.nomeCompleto();
      valid = valid && !!self.cpf();
      valid = valid && !!self.dataNascimento();
      valid = valid && !!self.endereco_cep();
      valid = valid && !!self.email();
      valid = valid && !!self.password();
      valid = valid && !!self.confirmPassword();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com seu cadastro.")
      }

      if ((!!self.password() && !!self.confirmPassword()) && self.password() != self.confirmPassword()) {
        errors.push("Verifique se as senhas são as mesmas.")
      }

      if (!!self.email() && !maskComponent.validateEmailFormat(self.email())) {
        errors.push("Este não é um email válido.");
      }

      return errors;
    };

    self.salvar = function(){
      var errors = self.validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      signupProfissional(generatePayload());
    };

    var generatePayload = function(){
      var payload = {
        nome           : self.nomeCompleto(),
        dataNascimento : momentComponent.convertStringToDate(self.dataNascimento()),
        sexo           : !!self.sexo() ? self.sexo() : 0,
        cpf            : self.cpf(),
        telefone       : self.telefone(),
        celular        : self.celular(),
        cep            : self.endereco_cep(),
        rua            : self.endereco_rua(),
        num            : self.endereco_num(),
        complemento    : self.endereco_comp(),
        bairro         : self.endereco_bairro(),
        cidade         : self.endereco_cidade(),
        estado         : !!self.endereco_estado() ? self.endereco_estado() : 0,
        email          : self.email(),
        password       : self.password()
      };

      return payload;
    };

    var init = function(){
      datepickerComponent.applyDatepicker();

      maskComponent.applyCPFMask();
      maskComponent.applyCelphoneMask();
      maskComponent.applyZipCodeMask();
      maskComponent.applyNumberMask();

      bridge.get("/api/clientes/form_options")
      .then(function(response){
        var sexos = response.sexos.map(function(sexo){
          return {
            id   : sexo.id,
            text : sexo.text
          }
        });

        self.sexos(sexos);

        var estados = response.estados.map(function(estado){
          return {
            id   : estado.id,
            text : estado.text
          }
        });

        self.estados(estados);
      })
      .then(function(){
        $('select').material_select();
      });
    };

    var signupProfissional = function(payload) {
      self.auth0.signup({
        connection: 'Username-Password-Authentication',
        email: payload.email,
        password: payload.password,
        "user_metadata": {
          "role": 1
        },
        auto_login: true,
        sso: false
      }, function (err, result) {
        if (!!err) {
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Um usuário com esse email já existe ou seu email não é válido, por favor verifique seus dados e tente novamente."]);
        } else {
          self.auth0.getProfile(result.idToken, function (err, profile) {
            payload.uuid = profile.identities[0].user_id;
            createCliente(payload, result, profile);
          });
        }
      });
    }

    var createCliente = function(payload, result, profile) {
      bridge.post("/api/clientes/new", payload)
      .fail(function(context, errorMessage, serverError){
        var errorTitle = 'Não foi possível concluir o cadastro';
        swalComponent.errorAlertWithTitle(errorTitle, context.errors);
        deleteUser(payload);
      })
      .done(function(response){
        localStorage.setItem('id_token', result.idToken);
        localStorage.setItem('current_user_id', response.cliente.id);
        localStorage.setItem('current_user_auth_id', response.cliente.uuid);
        localStorage.setItem('current_user_name', response.cliente.nome);
        localStorage.setItem('current_user_role', profile.user_metadata.role);
        localStorage.setItem('exp', result.idTokenPayload.exp);
        // TODO arrumar esse redirecionamento bosta
        window.location.hash = "#home";
      });
    }

    var deleteUser = function(payload) {
      var headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImRlbGV0ZSJdfX0sImlhdCI6MTQ3OTA5NTkzNywianRpIjoiZmY2YjM3OTIxZjA4NjA3NjA4ODZjYWQ4ZDQwYWQ2NjMifQ.0la4o_3aO3LnZaMycy4N6ujQgVOEXAQKMbYLBU30NLo'};

      bridge.del("https://pedrobelli.auth0.com/api/v2/connections/con_qpfJ1QFVlkD3q1aa/users?email=" + payload.email, headers)
      .fail(function(context, errorMessage, serverError){
        console.log(context);
      })
      .done(function(){
        console.log("Usuário deletado do auth0");
      });
    }


    init();
  }

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Cadastro de Clientes"
    }
  };
});
