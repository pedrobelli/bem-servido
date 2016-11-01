define (['jquery', 'ko', 'bridge', "materialize", 'text!footerTemplate', 'text!homeHeaderTemplate', 'text!orangeHeaderTemplate'],
function ($, ko, bridge, materialize, footer, homeHeader, orangeHeader) {

	var ViewModel = function() {
		var self = this;

		self.pageParams = ko.observable({});
  	self.pageComponent = ko.observable();

		self.footerComponent = ko.observable();
		self.headerComponent = ko.observable();

		self.appName = ko.observable('BemServido');

		self.showPage = function(pageComponentName, pageTitle, params) {
      document.title = self.appName() + ' - ' + pageTitle;

			if (params.header == "home") {
				self.headerComponent(homeHeader);
			} else if (params.header == "orange") {
				self.headerComponent(orangeHeader);
			}
			self.footerComponent(footer);

    	self.pageParams(params);
    	self.pageComponent(pageComponentName);

		// 	$(".button-collapse").sideNav();
    //  $('select').material_select();
	  };
	};

	return new ViewModel();
});
