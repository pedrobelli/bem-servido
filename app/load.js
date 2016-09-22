requirejs.config({
	shim : {
		"ko"              : { deps : ['jquery'] },
		"materialize"     : { deps : ['jquery'] },
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
    sweetAlert      : "components/sweetalert/lib/sweet-alert.min",
		hammerjs        : "components/hammerjs/hammer.min",
		velocity        : "components/velocity/velocity.min",
		sammy           : "components/sammy/lib/sammy",
		moment          : "components/moment/moment",
		text            : "lib/text",
		mainPath        : "./",

		// Components
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
		maskComponent               : 'pages/shared/mask/maskComponent',
		momentComponent             : 'pages/shared/moment/momentComponent',
		searchComponent             : 'pages/shared/search/searchComponent',
		swalComponent               : 'pages/shared/swal/swalComponent',

    // Templates
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

    // Styles


		//theme dependecies
		materialize : "lib/materialize.amd.min",
  }
});

require(["app"], function(app) {
  app.init();
});
