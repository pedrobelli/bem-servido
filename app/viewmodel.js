define ([
	'jquery',
	'ko',
	'bridge',
	'text!../pages/shared/footer.html',
	'text!../pages/shared/header.html'
], function ($, ko, bridge, footer, header) {

	var ViewModel = function() {
		var self = this;

		self.pageParams = ko.observable({});
  	self.pageComponent = ko.observable();
		self.isLoginPage = ko.observable(false);

		self.dashboardButton = function(){
			return window.location.hash = '#dashboard'
		}

		self.footerComponent = ko.observable();
		self.headerComponent = ko.observable();

		self.appName = ko.observable('BemServido');
		document.title = self.appName();

		self.showPage = function(pageComponentName, pageTitle, params) {
      document.title = self.appName() + ' - ' + pageTitle;

			if(params.name === 'authentication'){
				$('body').removeClass('white-bg');
				$('body').addClass('cyan body-login');
				$('html').addClass('html-login');
				self.footerComponent('');
				self.headerComponent('');
			} else {
				$('html').removeClass('html-login');
				$('body').removeClass('cyan body-login');
				$('body').addClass('white-bg');
				self.footerComponent(footer);
				self.headerComponent(header);
			}

      	self.pageParams(params);
      	self.pageComponent(pageComponentName);

      // if(true)
      //   return window.location.hash = '#login';
	  };
	};

	return new ViewModel();
});
