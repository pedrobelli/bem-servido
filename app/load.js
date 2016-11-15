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
		sammy           : "components/sammy/lib/sammy",
		sweetAlert      : "components/sweetalert/lib/sweet-alert.min",
		moment          : "components/moment/moment",

		hammerjs        : "components/hammerjs/hammer.min",
		waves           : "components/Waves/dist/waves.min",
		velocity        : "components/velocity/velocity.min",
		text            : "lib/text",

		//theme dependecies
		materialize : "lib/materialize",

		// Components
		frontendComponent           : 'pages/frontend/frontendComponent',
		headerComponent             : 'pages/header/headerComponent',
    homeComponent               : 'pages/home/homeComponent',
    atendimentosComponent       : 'pages/atendimentos/atendimentosComponent',
    atendimentosFormComponent   : 'pages/atendimentos/form/atendimentosFormComponent',
    clientesComponent           : 'pages/clientes/clientesComponent',
    clientesFormComponent       : 'pages/clientes/form/clientesFormComponent',
    profissionaisComponent      : 'pages/profissionais/profissionaisComponent',
    profissionaisFormComponent  : 'pages/profissionais/form/profissionaisFormComponent',
    especialidadesComponent     : 'pages/profissionais/especialidadesComponent',
    especialidadesFormComponent : 'pages/profissionais/form/especialidadesFormComponent',
    dadosHorarioComponent       : 'pages/profissionais/form/partials/dadosHorarioComponent',
    dadosProfissionalComponent  : 'pages/profissionais/form/partials/dadosProfissionalComponent',
    dadosServicoComponent       : 'pages/profissionais/form/partials/dadosServicoComponent',
		servicosComponent           : 'pages/servicos/servicosComponent',
		servicosFormComponent       : 'pages/servicos/form/servicosFormComponent',
		datepickerComponent         : 'pages/shared/datepicker/datepickerComponent',
		momentComponent             : 'pages/shared/moment/momentComponent',
		maskComponent               : '../pages/shared/mask/maskComponent',
		swalComponent               : '../pages/shared/swal/swalComponent',
		maskComponentForm           : '../../pages/shared/mask/maskComponent',
		swalComponentForm           : '../../pages/shared/swal/swalComponent',

    // Templates
		headerTemplate             : 'pages/header/headerTemplate.html',
    homeTemplate               : 'pages/home/homeTemplate.html',
    atendimentosTemplate       : 'pages/atendimentos/atendimentosTemplate.html',
    atendimentosFormTemplate   : 'pages/atendimentos/form/atendimentosFormTemplate.html',
    clientesTemplate           : 'pages/clientes/clientesTemplate.html',
    clientesFormTemplate       : 'pages/clientes/form/clientesFormTemplate.html',
    profissionaisTemplate      : 'pages/profissionais/profissionaisTemplate.html',
    profissionaisFormTemplate  : 'pages/profissionais/form/profissionaisFormTemplate.html',
    especialidadesTemplate     : 'pages/profissionais/especialidadesTemplate.html',
    especialidadesFormTemplate : 'pages/profissionais/form/especialidadesFormTemplate.html',
		dadosHorarioTemplate       : 'pages/profissionais/form/partials/dadosHorarioTemplate.html',
		dadosProfissionalTemplate  : 'pages/profissionais/form/partials/dadosProfissionalTemplate.html',
		dadosServicoTemplate       : 'pages/profissionais/form/partials/dadosServicoTemplate.html',
		servicosTemplate           : 'pages/servicos/servicosTemplate.html',
		servicosFormTemplate       : 'pages/servicos/form/servicosFormTemplate.html',
		searchTemplate             : 'pages/shared/search/searchTemplate.html',
		footerTemplate             : 'pages/shared/footer.html',

		agendaProfissionalTemplate           : 'pages/frontend/agendaProfissionalTemplate.html',
  }

	// Styles

});

require(["app"], function(app) {
  app.init();
});
