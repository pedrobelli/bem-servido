define (['jquery', 'underscore', 'ko', 'text!footerTemplate', 'moment', 'swalComponent'],
function ($, _, ko, footer, moment, swalComponent) {

	var ViewModel = function() {
		var self = this;

		self.pageParams = ko.observable({});
  	self.pageComponent = ko.observable();

		self.headerParams = ko.observable();
		self.headerComponent = ko.observable();
		self.footerComponent = ko.observable();

		self.appName = ko.observable('BemServido');

		self.showPage = function(pageComponentName, pageTitle, params) {
      document.title = self.appName() + ' - ' + pageTitle;

			self.headerParams(params);
			self.headerComponent("pages/header/headerComponent");
			self.footerComponent(footer);

			var duration = moment.duration(moment(parseInt(localStorage.getItem('exp')) * 1000).diff(Date.now()));
			if(isLogged() && duration.asMilliseconds() <= 1){
				swalComponent.customWarningActionWithTitle("Atenção", "Sua sessão expirou!", function(){
					logout();
				});
			}

			if (isLogged() && !hasUser() && window.location.hash != '#clientes/new') {
				window.location.hash = '#clientes/new';
				return location.reload(true);
			}

			if (params.dontAccessWhenLogged && isLogged()) {
				if (localStorage.getItem('current_user_role') == '1') {
					window.location.hash = '#home';
					return location.reload(true);
				} else {
					window.location.hash = '#profissionais/agendamentos';
					return location.reload(true);
				}
			}

			if (params.accessWhenLoggedOnly && !isLogged()) {
				window.location.hash = '#login';
				return location.reload(true);
			}

			if (params.rolesAccess && !hasRoleAccess(params.rolesAccess)) {
				if (localStorage.getItem('current_user_role') == '1') {
					window.location.hash = '#home';
					return location.reload(true);
				} else {
					window.location.hash = '#profissionais/agendamentos';
					return location.reload(true);
				}
			}

    	self.pageParams(params);
    	self.pageComponent(pageComponentName);

	  };

    var isLogged = function(){
      return !!localStorage.getItem('id_token');
    }

    var hasUser = function(){
      return !!localStorage.getItem('current_user_id') &&
        !!localStorage.getItem('current_user_auth_id') &&
        !!localStorage.getItem('current_user_name') &&
        !!localStorage.getItem('current_user_role');
    }

    var hasRoleAccess = function(rolesAccess){
			return _.contains(rolesAccess, parseInt(localStorage.getItem('current_user_role')));
    }

    var logout = function(){
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
    }
	};

	return new ViewModel();
});
