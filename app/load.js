requirejs.config({
	shim : {
		"ko"              : { deps : ['jquery'] },
		"hammerjs"        : { deps : ['jquery'] },
		"jqueryHammerjs"  : { deps : ['jquery', 'hammerjs', 'waves'] },
		"materialize"     : { deps : ['jquery', 'hammerjs', 'jqueryHammerjs', 'velocity'] },
    "jqueryInputmask" : { deps : ['jquery'] },
    "jqueryUi"        : { deps : ['jquery'] },
  },
  paths: {
		//core dependencies
    jquery          : "components/jquery/dist/jquery.min",
		jqueryUi        : "components/jquery-ui/",
    jqueryInputmask : "components/jquery.inputmask/dist/jquery.inputmask.bundle",
		ko              : "components/knockout/dist/knockout",
		underscore      : "components/underscore/underscore-min",
		sammy           : "components/sammy/lib/sammy",
		sweetAlert      : "components/sweetalert/lib/sweet-alert.min",
		moment          : "components/moment/moment",

		hammerjs        : "components/hammerjs/hammer.min",
		waves           : "components/Waves/dist/waves.min",
		jqueryHammerjs  : "lib/jquery.hammer",
		velocity        : "components/velocity/velocity.min",
		text            : "lib/text",

		//theme dependecies
		materialize : "lib/materialize.amd",

		// Components
    homeComponent               : 'pages/home/homeComponent',
    atendimentosComponent       : 'pages/atendimentos/atendimentosComponent',
    atendimentosFormComponent   : 'pages/atendimentos/form/atendimentosFormComponent',
    clientesComponent           : 'pages/clientes/clientesComponent',
    clientesFormComponent       : 'pages/clientes/form/clientesFormComponent',
    profissionaisComponent      : 'pages/profissionais/profissionaisComponent',
    profissionaisFormComponent  : 'pages/profissionais/form/profissionaisFormComponent',
    especialidadesComponent     : 'pages/profissionais/especialidadesComponent',
    especialidadesFormComponent : 'pages/profissionais/form/especialidadesFormComponent',
    dadosPessoaisComponent      : 'pages/profissionais/form/partials/dadosPessoaisComponent',
		servicosComponent           : 'pages/servicos/servicosComponent',
		servicosFormComponent       : 'pages/servicos/form/servicosFormComponent',
		datepickerComponent         : 'pages/shared/datepicker/datepickerComponent',
		momentComponent             : 'pages/shared/moment/momentComponent',
		maskComponent               : '../pages/shared/mask/maskComponent',
		swalComponent               : '../pages/shared/swal/swalComponent',
		maskComponentForm           : '../../pages/shared/mask/maskComponent',
		swalComponentForm           : '../../pages/shared/swal/swalComponent',

    // Templates
    homeTemplate               : 'pages/home/homeTemplate.html',
    atendimentosTemplate       : 'pages/atendimentos/atendimentosTemplate.html',
    atendimentosFormTemplate   : 'pages/atendimentos/form/atendimentosFormTemplate.html',
    clientesTemplate           : 'pages/clientes/clientesTemplate.html',
    clientesFormTemplate       : 'pages/clientes/form/clientesFormTemplate.html',
    profissionaisTemplate      : 'pages/profissionais/profissionaisTemplate.html',
    profissionaisFormTemplate  : 'pages/profissionais/form/profissionaisFormTemplate.html',
    especialidadesTemplate     : 'pages/profissionais/especialidadesTemplate.html',
    especialidadesFormTemplate : 'pages/profissionais/form/especialidadesFormTemplate.html',
		dadosPessoaisTemplate      : 'pages/profissionais/form/partials/dadosPessoaisTemplate',
		servicosTemplate           : 'pages/servicos/servicosTemplate.html',
		servicosFormTemplate       : 'pages/servicos/form/servicosFormTemplate.html',
		searchTemplate             : 'pages/shared/search/searchTemplate.html',
		orangeHeaderTemplate       : 'pages/shared/orangeHeader.html',
		homeHeaderTemplate         : 'pages/shared/homeHeader.html',
		footerTemplate             : 'pages/shared/footer.html',
  }

	// Styles

});

require(["app"], function(app) {
  app.init();
});
