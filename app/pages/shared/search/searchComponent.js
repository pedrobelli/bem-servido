define(['ko', 'text!./searchTemplate.html', 'bridge', 'jquery', 'materialize'],
function(ko, template, bridge, $, materialize) {

  var viewModel = function(params) {
    var self = this;

    self.queryValue = ko.observable();
    self.placeholderText = ko.observable();
    self.queried = ko.observableArray([]);
    self.subscriptions = [];
    self.endpoint = '';

    self.search = function(){
      var query = !!self.queryValue() ? self.queryValue() : '_';
      bridge.get(self.endpoint+"/"+query)
      .fail(function(context, errorMessage, serverError){
        console.log("Erros: ", context.errors);
      })
      .done(function(response){
          self.queried(response);
      });
    };

    self.subscribe = function(endpoint, callback){
        self.queryValue("");

        self.subscriptions.forEach(function(subscription){
            subscription.dispose();
        });

        self.endpoint = endpoint;
        var subscription = self.queried.subscribe(callback);
        self.subscriptions.push(subscription);
    };

    self.setPlaceholderText = function(placeholderOptions){
      var placeholderText = placeholderOptions.join(", ");
      self.placeholderText(placeholderText);
    };
  };

  var instance = new viewModel();

  ko.components.register('search-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
