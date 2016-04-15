define (['jquery', 'ko', 'bridge', 'text!../pages/shared/footer.html', 'text!../pages/shared/header.html'],
function ($, ko, bridge, footer, header) {

	var ViewModel = function() {
		var self = this;

		self.pageParams = ko.observable({});
  	self.pageComponent = ko.observable();

		self.footerComponent = ko.observable();
		self.headerComponent = ko.observable();

		self.appName = ko.observable('BemServido');

		self.showPage = function(pageComponentName, pageTitle, params) {
      document.title = self.appName() + ' - ' + pageTitle;

				self.footerComponent(footer);
				self.headerComponent(header);

      	self.pageParams(params);
      	self.pageComponent(pageComponentName);

	  };
	};

	return new ViewModel();
});
