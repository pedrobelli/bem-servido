define(['ko', 'text!headerTemplate', 'materialize', 'waves', 'momentComponent', 'datepickerComponent'],
function(ko, template, materialize, waves, momentComponent, datepickerComponent) {

  var viewModel = function(params) {
    var self = this;

    self.data = ko.observable(momentComponent.convertDateToString(new Date()));
    self.servico = ko.observable();
    self.cidade = ko.observable();
    self.home = ko.observable(false);
    self.logged = ko.observable(!!localStorage.getItem('current_user_id') && !!localStorage.getItem('current_user_auth_id') ? true : false);
    self.loggedWithoutUser = ko.observable(!localStorage.getItem('current_user_id') && !!localStorage.getItem('current_user_auth_id') ? true : false);
    self.notLogged = ko.observable(!localStorage.getItem('current_user_id') && !localStorage.getItem('current_user_auth_id') ? true : false);
    self.nome = ko.observable(!!localStorage.getItem('current_user_name') ? localStorage.getItem('current_user_name') : "");

    self.menuOptions = ko.observableArray([]);

    self.defaultOptions = [
      {
        link : '/#profissionais/register',
        text : 'Crie sua agenda Profissional!'
      },
      {
        link : '/#clientes/register',
        text : 'Cadastre-se'
      },
      {
        link : '/#login',
        text : 'Login'
      }
    ];

    self.clienteOptions = [
      {
        link : '#clientes/agendamentos/data=undefined',
        text : 'Meus agendamentos'
      },
      {
        link : '#clientes/qualificacoes',
        text : 'Qualificações'
      },
      {
        link : '#clientes/perfil',
        text : 'Meu Perfil'
      }
    ];

    self.profissionalOptions = [
      {
        link : '#profissionais/agendamentos',
        text : 'Meus agendamentos'
      },
      {
        link : '#profissionais/qualificacoes',
        text : 'Minhas qualificações'
      },
      {
        link : '#habilidades',
        text : 'Minhas habilidades'
      },
      {
        link : '#servicos',
        text : 'Meus serviços'
      },
      {
        link : '#horas_trabalho/edit',
        text : 'Meus horários'
      },
      {
        link : '#profissionais/relatorios',
        text : 'Relatórios'
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
    } else {
      self.menuOptions(self.defaultOptions);
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
      var servico = !!self.servico() ? self.servico() : undefined;
      var cidade = !!self.cidade() ? self.cidade() : undefined;
      var data = !!self.data() ? self.data() : undefined;

      return window.location.hash = '#pesquisa/servico=' + encodeURIComponent(servico) +
        '&cidade=' + encodeURIComponent(cidade) +
        '&data=' + encodeURIComponent(data);
    };

    init = function() {
      datepickerComponent.applyDatepickerForFuture();
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
