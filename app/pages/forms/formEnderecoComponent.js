define(['ko', 'text!formEnderecoTemplate', 'jquery', 'bridge', 'maskComponentForm', 'swalComponentForm'],
function(ko, template, $, bridge, maskComponent, swalComponent) {

  var viewModel = function(params) {
    var self = this;

    var formOptionsRoute = localStorage.getItem('current_user_role') == 1 ? "/api/clientes/form_options" : "/api/profissionais/form_options";
    var route = localStorage.getItem('current_user_role') == 1 ? "#clientes/perfil" : "#profissionais/perfil";

    self.endereco_rua = ko.observable();
    self.endereco_num   = ko.observable();
    self.endereco_comp = ko.observable();
    self.endereco_bairro = ko.observable();
    self.endereco_cep = ko.observable();
    self.endereco_cidade = ko.observable();
    self.endereco_estado = ko.observable();

    self.estados = ko.observableArray([]);

    self.errorTitle = "Ocorreu um erro na atualização de seu endereço!";

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

    self.cancelar = function(){
      return window.location.hash = route;
    };

    self.salvar = function(){
      var errors = validate();

      if (errors.length > 0) {
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      bridge.post("/api/enderecos/edit", generatePayload())
      .fail(function(context, errorMessage, serverError){
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
      })
      .done(function(response){
        return window.location.hash = route;
      });

    };

    var validate = function(){
      var errors = []
      valid = !!self.endereco_cep();
      valid = valid && !!self.endereco_num();

      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com a edição de seu endereço.");
      }

      return errors;
    };

    var generatePayload = function(){
      var payload = {
        id          : params.id,
        cep         : self.endereco_cep(),
        rua         : self.endereco_rua(),
        num         : self.endereco_num(),
        complemento : self.endereco_comp(),
        bairro      : self.endereco_bairro(),
        cidade      : self.endereco_cidade(),
        estado      : !!self.endereco_estado() ? self.endereco_estado() : 0
      };

      if (localStorage.getItem('current_user_role') == 1) payload.clienteId = localStorage.getItem('current_user_id');
      if (localStorage.getItem('current_user_role') == 2) payload.pofissionalId = localStorage.getItem('current_user_id');

      return payload;
    };

    var init = function(){
      maskComponent.applyZipCodeMask();
      maskComponent.applyNumberMask();

      bridge.get(formOptionsRoute)
      .then(function(response){
        var estados = response.estados.map(function(estado){
          return {
            id   : estado.id,
            text : estado.text
          }
        });

        self.estados(estados);
      })
      .then(function(){
        return bridge.get("api/enderecos/get/" + params.id)
        .then(function(response){
          self.endereco_cep(response.endereco.cep);
          self.endereco_rua(response.endereco.rua);
          self.endereco_num(response.endereco.num);
          self.endereco_comp(response.endereco.complemento);
          self.endereco_bairro(response.endereco.bairro);
          self.endereco_cidade(response.endereco.cidade);
          self.endereco_estado(!!response.endereco.estado ? response.endereco.estado : undefined);
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
      return "Atualizar endereço"
    }
  };
});
