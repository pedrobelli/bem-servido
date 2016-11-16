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
		auth0Lock       : "components/auth0-lock/build/lock.min",
		auth0           : "components/auth0.js/build/auth0.min",

		hammerjs        : "components/hammerjs/hammer.min",
		waves           : "components/Waves/dist/waves.min",
		velocity        : "components/velocity/velocity.min",
		text            : "lib/text",

		//theme dependecies
		materialize : "lib/materialize",

		// Components
		headerComponent             : 'pages/header/headerComponent',
		socialAuthComponent         : 'pages/socialAuth/socialAuthComponent',
		clientesFormComponent       : 'pages/clientes/form/clientesFormComponent',
    homeComponent               : 'pages/home/homeComponent',
		pesquisaComponent           : 'pages/home/pesquisaComponentComponent',
    loginComponent              : 'pages/login/loginComponent',
		profissionaisFormComponent  : 'pages/profissionais/form/profissionaisFormComponent',


    atendimentosComponent       : 'pages/atendimentos/atendimentosComponent',
    atendimentosFormComponent   : 'pages/atendimentos/form/atendimentosFormComponent',
    clientesComponent           : 'pages/clientes/clientesComponent',
    profissionaisComponent      : 'pages/profissionais/profissionaisComponent',
    especialidadesComponent     : 'pages/profissionais/especialidadesComponent',
    especialidadesFormComponent : 'pages/profissionais/form/especialidadesFormComponent',
    dadosHorarioComponent       : 'pages/profissionais/form/partials/dadosHorarioComponent',
    dadosProfissionalComponent  : 'pages/profissionais/form/partials/dadosProfissionalComponent',
    dadosServicoComponent       : 'pages/profissionais/form/partials/dadosServicoComponent',
    dadosUsuarioComponent       : 'pages/profissionais/form/partials/dadosUsuarioComponent',
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
		socialAuthTemplate         : 'pages/socialAuth/socialAuthTemplate.html',
		clientesFormTemplate       : 'pages/clientes/form/clientesFormTemplate.html',
    homeTemplate               : 'pages/home/homeTemplate.html',
		pesquisaTemplate           : 'pages/home/pesquisaTemplate.html',
    loginTemplate              : 'pages/login/loginTemplate.html',
		profissionaisFormTemplate  : 'pages/profissionais/form/profissionaisFormTemplate.html',


    atendimentosTemplate       : 'pages/atendimentos/atendimentosTemplate.html',
    atendimentosFormTemplate   : 'pages/atendimentos/form/atendimentosFormTemplate.html',
    clientesTemplate           : 'pages/clientes/clientesTemplate.html',
    profissionaisTemplate      : 'pages/profissionais/profissionaisTemplate.html',
    especialidadesTemplate     : 'pages/profissionais/especialidadesTemplate.html',
    especialidadesFormTemplate : 'pages/profissionais/form/especialidadesFormTemplate.html',
		dadosHorarioTemplate       : 'pages/profissionais/form/partials/dadosHorarioTemplate.html',
		dadosProfissionalTemplate  : 'pages/profissionais/form/partials/dadosProfissionalTemplate.html',
		dadosServicoTemplate       : 'pages/profissionais/form/partials/dadosServicoTemplate.html',
		dadosUsuarioTemplate       : 'pages/profissionais/form/partials/dadosUsuarioTemplate.html',
		servicosTemplate           : 'pages/servicos/servicosTemplate.html',
		servicosFormTemplate       : 'pages/servicos/form/servicosFormTemplate.html',
		searchTemplate             : 'pages/shared/search/searchTemplate.html',
		footerTemplate             : 'pages/shared/footer.html',

		// frontendComponent           : 'pages/frontend/frontendComponent',
		// agendaTemplate : 'pages/frontend/agendaTemplate.html',
		// agendaProfissionalTemplate : 'pages/frontend/agendaProfissionalTemplate.html',
		agendaClienteTemplate      : 'pages/frontend/agendaClienteTemplate.html',
		// pesquisaTemplate           : 'pages/frontend/pesquisaTemplate.html',
  }

	// Styles

});

require(["app"], function(app) {
  app.init();
});
