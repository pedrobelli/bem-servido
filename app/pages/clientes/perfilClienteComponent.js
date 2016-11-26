define(['ko', 'text!perfilClienteTemplate', 'bridge', 'maskComponent', 'momentComponent', 'auth0Component'],
function(ko, template, bridge, maskComponent, momentComponent, auth0Component) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = auth0Component.createAuth0Instance();

    self.nome = ko.observable();
    self.cpf = ko.observable();
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
            id    : estado.id,
            text  : estado.text,
            sigla : estado.sigla
          }
        });

        self.estados(estados);
      })
      .then(function() {
        return bridge.get("/api/clientes/get/" + localStorage.getItem('current_user_id'))
        .then(function(response){
          var cliente = response.cliente;
          var endereco = cliente.endereco;
          var sexo = _.find(self.sexos(), function(currentSexo){ return currentSexo.id == cliente.sexo; });
          var estado = _.find(self.estados(), function(estado){ return estado.id == endereco.estado; });

          self.nome(cliente.nome);
          self.cpf(cliente.cpf);
          self.sexo(!!sexo ? sexo.text : "");
          self.dataNascimento(momentComponent.convertDateToString(momentComponent.convertDateStringToDate(cliente.dataNascimento)));
          self.telefone(!!cliente.telefone.telefone ? cliente.telefone.telefone : "");
          self.celular(!!cliente.telefone.celular ? cliente.telefone.celular : "");
          self.enderecoId(endereco.id);
          self.cep(endereco.cep);
          self.endereco(maskComponent.addressFormat(cliente.endereco, estado));

        });
      })
      .then(function() {
        maskComponent.applyCPFMask();
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
      return "Perfil do cliente"
    }
  };
});
