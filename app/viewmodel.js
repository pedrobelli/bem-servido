define (['jquery', 'ko', 'text!footerTemplate'],
function ($, ko, footer) {

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

    	self.pageParams(params);
    	self.pageComponent(pageComponentName);
	  };
	};

	return new ViewModel();
});
