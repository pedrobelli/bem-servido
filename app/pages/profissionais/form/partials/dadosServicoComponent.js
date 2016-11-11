define(['ko', 'text!dadosServicoTemplate', 'jquery', 'underscore', 'bridge', 'maskComponentForm'],
function(ko, template, $, _, bridge, maskComponent) {

  var viewModel = function(params) {
    var self = this;

    self.ramo = ko.observable();

    self.ramos = ko.observableArray([]);
    self.habilidades = ko.observableArray([]);
    self.habilidadesSelecionadas = [];
    self.servicosSelecionados = [];

    self.validate = function() {
      var errors = []
      valid = !!self.ramo();
      if (!valid) {
        errors.push("Os campos obrigatórios estão todos identificados(*), preencha para continuar com seu cadastro.")
      }

      self.habilidades().forEach(function(habilidade){
        habilidade.servicos.forEach(function(servico){
          if (servico.checked()) {
            if (!servico.valor() || !servico.duracao()) {
              errors.push("É necessário preencher os campos valor e duração dos serviços selecionados")
            }
          }
        });
      });

      return errors;
    };

    self.show = function() {
      $('#dados-servico').fadeIn();
    };

    self.hide = function() {
      $('#dados-servico').fadeOut();
    };

    self.subscribe = function() {
      $('select').material_select();
      $('.collapsible').collapsible();

      maskComponent.applyNumberMask();
      maskComponent.applyCurrencyMask();
    };

    self.cleanFields = function() {
      self.ramo(undefined);
      self.ramos([]);
      self.habilidades([]);
      self.habilidadesSelecionadas = [];
      self.servicosSelecionados = [];
    };

    self.mapResponse = function(response) {
      var ramos = response.ramos.map(function(ramo){
        return {
          id   : ramo.id,
          text : ramo.text
        }
      });

      self.ramos(ramos);
    };

    self.check = function(servico){
      if (servico.checked()) {
        servico.checked(false);
        servico.valor(undefined);
        servico.duracao(undefined);
        $('#servico' + servico.id).removeClass('material-checkbox');

        self.servicosSelecionados = _.without(self.servicosSelecionados, servico.id);

        var habilidade = _.find(self.habilidades(), function(habilidade){
          return habilidade.id == servico.habilidadeId;
        });
        var servico = _.find(habilidade.servicos, function(servicoTemp){
          return _.contains(self.servicosSelecionados, servicoTemp.id);
        });

        if (!servico) self.habilidadesSelecionadas = _.without(self.habilidadesSelecionadas, habilidade.id);
      } else {
        servico.checked(true);
        $('#servico' + servico.id).addClass('material-checkbox');

        self.servicosSelecionados.push(servico.id);

        self.habilidadesSelecionadas.push(servico.habilidadeId);
        self.habilidadesSelecionadas = _.uniq(self.habilidadesSelecionadas);
      }
    };

    self.loadHabilidades = ko.computed(function(){
      if (!!self.ramo()) {
        self.habilidadesSelecionadas = [];
        self.servicosSelecionados = [];
        bridge.get("/api/especialidades/seeded_by_ramo/"+self.ramo())
        .then(function(response){
          mapResponseToHabilidades(response.especialidades);
        })
      }
    });

    self.generatePayload = function(payload){
      payload.ramo = self.ramo();
      payload.especialidades = JSON.stringify(self.habilidadesSelecionadas);

      var servicos = [];
      self.habilidades().forEach(function(habilidade){
        habilidade.servicos.forEach(function(servico){
          if (servico.checked()) {
            servicos.push({
              valor           : servico.valor(),
              duracao         : servico.duracao(),
              servicoId       : servico.id
            });
          }
        });
      });
      payload.servicos = JSON.stringify(servicos);

      return payload;
    };

    var mapResponseToHabilidades = function(habilidades){
      if(!habilidades.length) {
        self.habilidades([]);
        $('.collapsible').collapsible();
        $('#dados-habilidades').fadeOut();

        return;
      }

      var habilidades = habilidades.map(function(habilidade){
        var servicos = habilidade.servicos.map(function(servico){
          return {
            habilidadeId : habilidade.id,
            id           : servico.id,
            text         : servico.nome,
            valor        : ko.observable(undefined),
            duracao      : ko.observable(undefined),
            checked      : ko.observable(false)
          }
        });

        return {
          id       : habilidade.id,
          text     : habilidade.nome,
          servicos : servicos
        }
      });

      self.habilidades(habilidades);
      self.subscribe();
      $('#dados-habilidades').fadeIn();
    };

  }

  var instance = new viewModel();

  ko.components.register('dados-servico-component', {
    viewModel: {
      instance : instance
    },
    template: template
  });

  return instance;
});
