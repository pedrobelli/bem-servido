define(['ko', 'text!profissionaisFormTemplate', 'jquery', 'bridge', 'auth0', 'swalComponentForm', "dadosUsuarioComponent",
'dadosProfissionalComponent', 'dadosServicoComponent', 'dadosHorarioComponent'],
function(ko, template, $, bridge, auth0, swalComponent, dadosUsuarioComponent, dadosProfissionalComponent, dadosServicoComponent,
dadosHorarioComponent) {

  var viewModel = function(params) {
    var self = this;

    self.auth0 = new auth0({
      domain: 'pedrobelli.auth0.com',
      clientID: 'hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM'
    });

    self.textoProximo = ko.observable('PRÓXIMO');
    self.errorTitle = "Ocorreu um erro em seu cadastro!";
    self.posicao = 0;

    self.components = [dadosUsuarioComponent, dadosProfissionalComponent, dadosServicoComponent, dadosHorarioComponent];

    self.components.forEach(function(component){
      component.cleanFields();
    });

    self.anterior = function(){
      var posicaoAtual = self.posicao;
      if (posicaoAtual == 0) {
        return;
      } else if (posicaoAtual == 1) {
        $('#anterior').fadeOut();
      } else if (posicaoAtual == 3) {
        self.textoProximo('PRÓXIMO');
      }

      self.posicao = posicaoAtual - 1;

      self.components[posicaoAtual].hide();
      self.components[self.posicao].show();
    };

    self.proximo = function(){
      var errors = [];
      for (var i = self.posicao; i >= 0; i--) {
        errors = errors.concat(self.components[i].validate());
      }

      if (errors.length > 0) {
        errors = _.uniq(errors);
        return swalComponent.simpleErrorAlertWithTitle(self.errorTitle, errors);
      }

      var posicaoAtual = self.posicao;
      if (posicaoAtual == 3) {
        var payload = {};
        self.components.forEach(function(component){
          payload = component.generatePayload(payload);
        });

        signupProfissional(payload);
        return;
      } else if (posicaoAtual == 0) {
        $('#anterior').fadeIn();
      } else if (posicaoAtual == 2) {
        self.textoProximo('CONCLUIR');
      }

      self.posicao = posicaoAtual + 1;

      self.components[posicaoAtual].hide();
      self.components[self.posicao].show();
    };

    var init = function(){
      bridge.get("/api/profissionais/form_options")
      .then(function(response){
        var position = 0;
        self.components.forEach(function(component){
          if (position != 0) {
            component.mapResponse(response);
          }
          position++;
        });
      })
      .then(function(){
        self.components.forEach(function(component){
          component.subscribe();
        });
      });
    };

    var signupProfissional = function(payload) {
      self.auth0.signup({
        connection: 'Username-Password-Authentication',
        email: payload.email,
        password: payload.password,
        "user_metadata": {
          "role": 2
        },
        auto_login: true,
        sso: false
      }, function (err, result) {
        if (!!err) {
          swalComponent.simpleErrorAlertWithTitle(self.errorTitle, ["Um usuário com esse email já existe ou seu email não é válido, por favor verifique seus dados e tente novamente."]);
        } else {
          self.auth0.getProfile(result.idToken, function (err, profile) {
            payload.uuid = profile.user_id;
            createProfissional(payload, result, profile);
          });
        }
      });
    }

    var createProfissional = function(payload, result, profile) {
      bridge.post("/api/profissionais/new", payload)
      .fail(function(context, errorMessage, serverError){
        swalComponent.errorAlertWithTitle(self.errorTitle, context.errors);
        deleteUser(profile);
      })
      .done(function(response){
        localStorage.setItem('id_token', result.idToken);
        localStorage.setItem('current_user_id', response.profissional.id);
        localStorage.setItem('current_user_auth_id', response.profissional.uuid);
        localStorage.setItem('current_user_name', response.profissional.nome);
        localStorage.setItem('current_user_role', profile.user_metadata.role);
        localStorage.setItem('exp', result.idTokenPayload.exp);
        // TODO arrumar esse redirecionamento bosta
        window.location.hash = "#home";
      });
    }

    var deleteUser = function(profile) {
      var headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImRlbGV0ZSJdfX0sImlhdCI6MTQ3OTIzMTg4NiwianRpIjoiM2I2YWIyMGI1NjllMDc5ZDBkNjg3MjViN2Y2OTc1OWUifQ.fjPTPC0BBV1ibLAD40KXgD28sq7pvW5dAuEQ6_K5pog'};

      bridge.del('https://pedrobelli.auth0.com/api/v2/users/' + profile.user_id, headers)
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
      return "Cadastro de Profissional"
    }
  };
});
