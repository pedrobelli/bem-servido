define(['ko', 'text!perfilProfissionalTemplate', 'bridge', 'maskComponent', 'momentComponent', 'auth0Component'],
function(ko, template, bridge, maskComponent, momentComponent, auth0Component) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = auth0Component.createAuth0Instance();

    self.nome = ko.observable();
    self.cpfCnpj = ko.observable();
    self.dataNascimento = ko.observable();
    self.telefone = ko.observable();
    self.celular = ko.observable();
    self.sexo = ko.observable();
    self.enderecoId = ko.observable();
    self.cep = ko.observable();
    self.endereco = ko.observable();
    self.email = ko.observable();

    self.sexos = ko.observableArray([]);
    self.estados = ko.observableArray([]);

    var init = function(){
      bridge.get("/api/profissionais/form_options")
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
            id    : estado.id,
            text  : estado.text,
            sigla : estado.sigla
          }
        });

        self.estados(estados);
      })
      .then(function() {
        return bridge.get("/api/profissionais/get/" + localStorage.getItem('current_user_id'))
        .then(function(response){
          var profissional = response.profissional;
          var endereco = profissional.endereco;
          var sexo = _.find(self.sexos(), function(currentSexo){ return currentSexo.id == profissional.sexo; });
          var estado = _.find(self.estados(), function(estado){ return estado.id == endereco.estado; });

          var enderecoString = endereco.rua + ", " + endereco.num ;
          if (!!endereco.complemento) enderecoString = enderecoString + ", " + endereco.complemento;
          enderecoString = enderecoString + " - " + endereco.bairro + ", " + endereco.cidade + " - " + estado.sigla,

          self.nome(profissional.nome);
          self.cpfCnpj(profissional.cpf_cnpj);
          self.sexo(!!sexo ? sexo.text : "");
          self.dataNascimento(momentComponent.convertDateToString(momentComponent.convertDateStringToDate(profissional.dataNascimento)));
          self.telefone(!!profissional.telefone.telefone ? profissional.telefone.telefone : "");
          self.celular(!!profissional.telefone.celular ? profissional.telefone.celular : "");
          self.enderecoId(endereco.id);
          self.cep(endereco.cep);
          self.endereco(enderecoString);

        });
      })
      .then(function() {
        maskComponent.applyCPF_CNPJMask();
        maskComponent.applyCelphoneMask();
        maskComponent.applyZipCodeMask();
      })
      .then(function() {
        self.auth0.getProfile(localStorage.getItem('id_token'), function (err, profile) {
            self.email(profile.email)
        });
      });

    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Perfil do profissional"
    }
  };
});
