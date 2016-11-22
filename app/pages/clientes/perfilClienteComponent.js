define(['ko', 'text!perfilClienteTemplate', 'bridge', 'maskComponent', 'momentComponent'],
function(ko, template, bridge, maskComponent, momentComponent) {

  var viewModel = function(params) {
    var self = this;

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

          var enderecoString = endereco.rua + ", " + endereco.num ;
          if (!!endereco.complemento) enderecoString = enderecoString + ", " + endereco.complemento;
          enderecoString = enderecoString + " - " + endereco.bairro + ", " + endereco.cidade + " - " + estado.sigla,

          self.nome(cliente.nome);
          self.cpf(cliente.cpf);
          self.sexo(sexo.text);
          self.dataNascimento(momentComponent.convertDateToString(momentComponent.convertDateStringToDate(cliente.dataNascimento)));
          self.telefone(!!cliente.telefone.telefone ? cliente.telefone.telefone : "");
          self.celular(!!cliente.telefone.celular? cliente.telefone.celular : "");
          self.enderecoId(endereco.id);
          self.cep(endereco.cep);
          self.endereco(enderecoString);

        })
      })
      .then(function() {
        maskComponent.applyCPFMask();
        maskComponent.applyCelphoneMask();
        maskComponent.applyZipCodeMask();
      })
      .then(function() {
        var headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX0sInVzZXJfaWRwX3Rva2VucyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0Nzk4NTY3MTQsImp0aSI6ImQxMTQzNDg2NGQ1NjMzZjhhZTYxZTRhNjM1MzliYjQ4In0.9CCHse78u9e86Twy1Lhk-f-u9yBRzvcvMaFU87lWZtU'};

        bridge.get('https://pedrobelli.auth0.com/api/v2/users/' + localStorage.getItem('current_user_auth_id'), headers)
        .fail(function(context, errorMessage, serverError){
          console.log(context);
        })
        .done(function(response){
          console.log("Usuário pego do auth0");
          self.email(response.email)
        });
      });

    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "servicosEdit"
    }
  };
});
