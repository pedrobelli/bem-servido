define(['jquery', 'hammerjs', 'jqueryHammerjs', 'ko', 'underscore', 'sammy', 'text!routes.json', './viewmodel'],
function ($, hammerjs, jqueryHammerjs, ko, _, sammyFramework, routesText, appViewModel) {

  var routes = JSON.parse(routesText);
  var sammy = sammyFramework();
  sammy.raise_errors = true;

  var loadPageModules = function() {
    var result = $.Deferred();
    var pagesModuleNames = _.uniq(routes.map(function(route) { return route.page }));

    require(pagesModuleNames, function() {
      var pages = arguments;
      var pagesByModuleName = {};
      pagesModuleNames.forEach(function (pageModuleName, pageIndex) {
        pagesByModuleName[pageModuleName] = pages[pageIndex];
      });

      result.resolve(pagesByModuleName);
    });

    return result.promise();
  };

  var registerPageComponents = function(pagesByModuleName) {
    _.keys(pagesByModuleName).forEach(function(pageModuleName) {
      var page = pagesByModuleName[pageModuleName];

      ko.components.register(pageModuleName, {
        viewModel: page.viewModel || Object,
        template: page.template
      });
    });
  };

  var configureRoutes = function(pagesByModuleName) {
    routes.forEach(function(route) {
      var pageModuleName = route.page;
      var page = pagesByModuleName[pageModuleName];

      sammy.get(route.path, function(context) {
        var params = $.extend({}, route.params, context.params);
        var pageTitle = (typeof page.title === "function") ? page.title(params) : page.title;

        appViewModel.showPage(pageModuleName, pageTitle, params);
      });
    });
  };

  return {
    init: function() {
      loadPageModules()
      .done(registerPageComponents)
      .done(configureRoutes)
      .done(function() {
        sammy.run("#home");
        ko.applyBindings(appViewModel);
        window.ko = ko;
      });

    }
  };
});
