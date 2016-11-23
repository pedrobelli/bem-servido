define(['ko', 'text!headerTemplate', 'materialize', 'waves'],
function(ko, template, materialize, waves) {

  var viewModel = function(params) {
    var self = this;

    self.servico = ko.observable();
    self.cidade = ko.observable();
    self.home = ko.observable(false);
    self.logged = ko.observable(!!localStorage.getItem('current_user_id') ? true : false);
    self.nome = ko.observable(!!localStorage.getItem('current_user_name') ? localStorage.getItem('current_user_name') : "");

    self.menuOptions = ko.observableArray([]);

    self.clienteOptions = [
      {
        link : '#clientes/atendimentos',
        text : 'Meus agendamentos'
      },
      {
        link : '#clientes/perfil',
        text : 'Meu Perfil'
      }
    ];

    self.profissionalOptions = [
      {
        link : '#',
        text : 'Meus agendamentos'
      },
      {
        link : '#',
        text : 'Meus serviços'
      },
      {
        link : '#',
        text : 'Meus horários'
      },
      {
        link : '#profissionais/perfil',
        text : 'Meu Perfil'
      }
    ];

    if (!!localStorage.getItem('current_user_role')) {
      if (localStorage.getItem('current_user_role') == 1) {
        self.menuOptions(self.clienteOptions);
      } else if (localStorage.getItem('current_user_role') == 2) {
        self.menuOptions(self.profissionalOptions);
      }
    }

    if (params.header == "home") {
      self.home(true);
      $("#site-header").addClass("topheader-home");
      $("#site-nav").removeClass("topheader-default");
      $("#site-nav").removeClass("orange");
    } else if (params.header == "orange") {
      $("#site-header").removeClass("topheader-home");
      $("#site-header").removeClass("topheader-default");
      $("#site-nav").addClass("orange");
    } else if (params.header == "default") {
      $("#site-header").removeClass("topheader-home");
      $("#site-header").addClass("topheader-default");
      $("#site-nav").removeClass("orange");
    }

    self.logout = function(){
      if (localStorage.getItem('id_token')) {
        localStorage.setItem('old_id_token', localStorage.getItem('id_token'));
        localStorage.removeItem('id_token');
        localStorage.removeItem('current_user_id');
        localStorage.removeItem('current_user_auth_id');
        localStorage.removeItem('current_user_name');
        localStorage.removeItem('current_user_role');
        localStorage.removeItem('exp');
        window.location.hash = '#home';
        location.reload(true);
      }
    };

    self.pesquisa = function(){
      return window.location.hash = '#pesquisa/servico=' + encodeURIComponent(self.servico()) + '&cidade=' + encodeURIComponent(self.cidade());
    };

    init = function() {
      Waves.displayEffect();
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }

    init();
  };

  return {
    viewModel: viewModel,
    template: template,
  };
});
