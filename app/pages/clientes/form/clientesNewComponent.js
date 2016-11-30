define(['ko', 'text!clientesNewTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm',
'datepickerComponent', 'momentComponent', 'pace'],
function(ko, template, $, bridge, maskComponent, swalComponent, datepickerComponent, momentComponent, pace) {

  var viewModel = function(params) {
    var self = this;

    if (!!localStorage.getItem('current_user_id') && !!localStorage.getItem('current_user_auth_id'))
        window.location.hash = "#home";

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

    self.salvar = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post("/api/clientes/new", generatePayload())
      .fail(function(context, errorMessage, serverError){
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
      })
      .done(function(response){
        localStorage.setItem('current_user_id', response.cliente.id);
        localStorage.setItem('current_user_name', response.cliente.nome);
        return window.location.hash = "#home";
      });

    };

    var validate = function(){
      var errors = []
      valid = !!self.nomeCompleto();
      valid = valid && !!self.cpf();
      valid = valid && !!self.dataNascimento();
      valid = valid && !!self.endereco_cep();
      valid = valid && !!self.endereco_num();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar seu cadastro.");
      }

      if (!!self.cpf() && self.cpf().length == 11 && !maskComponent.validateCPFFormat(self.cpf())) {
        errors.push("Este não é um CPF válido.");
      }

      return errors;
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
        uuid           : localStorage.getItem('current_user_auth_id')
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
