define(['ko', 'text!homeTemplate', 'bridge', 'momentComponent', 'maskComponent'],
function(ko, template, bridge, momentComponent, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.data = momentComponent.convertDateToString(new Date());

    self.ramos = ko.observableArray([]);
    self.estados = ko.observableArray([]);
    self.profissionais = ko.observableArray([]);

    var generatePayload = function(){
      var payload = {
        data      : self.data,
        diaSemana : momentComponent.returnDateWeekday(self.data),
        home      : true
      };

      return payload;
    };

    self.visualizar = function(profissional){
      return window.location.hash = '#atendimentos/new/profissional=' + profissional.id + '&data=' + encodeURIComponent(self.data);
    };

    var mapResponseToProfissionais = function(profissionais){
      if(!profissionais.length) return self.profissionais([]);

      var profissionais = profissionais.map(function(profissional){
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });
        var estado = _.find(self.estados(), function(estado){ return estado.id == profissional.endereco.estado; });
        var estrelas = [];

        for(var cont = 1; cont <= 5; cont++) {
          estrelas.push({
            isGrey : profissional.mediaNota >= cont ? false : true
          });
        }

        return {
          id       : profissional.id,
          nome     : profissional.nome,
          ramo     : ramo.text,
          telefone : profissional.telefone.telefone,
          celular  : profissional.telefone.celular,
          endereco : maskComponent.addressFormat(profissional.endereco, estado),
          estrelas : estrelas
        }
      });

      self.profissionais(profissionais);
    };

     var init = function() {
       bridge.get("/api/profissionais/pesquisa/form_options")
       .then(function(response){
         var ramos = response.ramos.map(function(ramo){
           return {
             id   : ramo.id,
             text : ramo.text
           }
         });

         self.ramos(ramos);

         var estados = response.estados.map(function(estado){
           return {
             id    : estado.id,
             text  : estado.text,
             sigla : estado.sigla
           }
         });

         self.estados(estados);
       })
       .then(function() {
         return bridge.post("/api/profissionais/search", generatePayload())
         .then(function(response){
           mapResponseToProfissionais(response.profissionais);
         });
       })
       .then(function() {
         maskComponent.applyCelphoneMask();
       });
     }

     init();
  };

  return {
    viewModel: viewModel,
    template: template,
    title: function(params) {
      return "Home"
    }
  };
});
