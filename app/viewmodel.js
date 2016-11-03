define (['jquery', 'ko', 'bridge', 'text!footerTemplate'],
function ($, ko, bridge, footer) {

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

			// self.headerParams(params);
			// self.headerComponent("pages/header/headerComponent");
			// if (params.header == "home") {
			// 	self.headerComponent(homeHeader);
			// } else if (params.header == "orange") {
			// 	self.headerComponent(orangeHeader);
			// }
			self.footerComponent(footer);

    	self.pageParams(params);
    	self.pageComponent(pageComponentName);
			console.log('BUNDA');
	  };
	};

	return new ViewModel();
});
