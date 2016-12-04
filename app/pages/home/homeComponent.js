define(['ko', 'text!homeTemplate', 'bridge', 'momentComponent', 'maskComponent', 'qualificacaoComponent'],
function(ko, template, bridge, momentComponent, maskComponent, qualificacaoComponent) {

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
      return window.location.hash = '#agendamentos/new/profissional=' + profissional.id + '&data=' + encodeURIComponent(self.data);
    };

    var mapResponseToProfissionais = function(profissionais){
      if(!profissionais.length) return self.profissionais([]);

      var profissionais = profissionais.map(function(profissional){
        var ramo = _.find(self.ramos(), function(currentRamo){ return currentRamo.id == profissional.ramo; });
        var estado = _.find(self.estados(), function(estado){ return estado.id == profissional.endereco.estado; });

        return {
          id       : profissional.id,
          nome     : profissional.nome,
          ramo     : ramo.text,
          telefone : profissional.telefone.telefone,
          celular  : profissional.telefone.celular,
          endereco : maskComponent.addressFormat(profissional.endereco, estado),
          estrelas : qualificacaoComponent.buildStarsArray(profissional.mediaNota)
        }
      });

      self.profissionais(profissionais.slice(0, 10));
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
