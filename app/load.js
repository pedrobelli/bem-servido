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
		pace            : "components/PACE/pace",

		hammerjs        : "components/hammerjs/hammer.min",
		waves           : "components/Waves/dist/waves.min",
		velocity        : "components/velocity/velocity.min",
		text            : "lib/text",

		//theme dependecies
		materialize : "lib/materialize",

		// Components
		headerComponent                       : 'pages/header/headerComponent',
		socialAuthComponent                   : 'pages/socialAuth/socialAuthComponent',
		atendimentosFormComponent             : 'pages/atendimentos/form/atendimentosFormComponent',
		atendimentoModalComponent             : 'pages/atendimentos/form/atendimentoModalComponent',
		clientesFormComponent                 : 'pages/clientes/form/clientesFormComponent',
		agendaClienteComponent                : 'pages/clientes/agendaClienteComponent',
		perfilClienteComponent                : 'pages/clientes/perfilClienteComponent',
    homeComponent                         : 'pages/home/homeComponent',
    loginComponent                        : 'pages/login/loginComponent',
		dadosHorarioComponent                 : 'pages/profissionais/form/partials/dadosHorarioComponent',
		dadosProfissionalComponent            : 'pages/profissionais/form/partials/dadosProfissionalComponent',
		dadosServicoComponent                 : 'pages/profissionais/form/partials/dadosServicoComponent',
		dadosUsuarioComponent                 : 'pages/profissionais/form/partials/dadosUsuarioComponent',
		especialidadesFormComponent           : 'pages/profissionais/form/especialidadesFormComponent',
		profissionaisFormComponent            : 'pages/profissionais/form/profissionaisFormComponent',
		profissionalAtendimentoModalComponent : 'pages/profissionais/form/profissionalAtendimentoModalComponent',
		agendaProfissionalComponent           : 'pages/profissionais/agendaProfissionalComponent',
		especialidadesComponent               : 'pages/profissionais/especialidadesComponent',
		pesquisaComponent                     : 'pages/profissionais/pesquisaComponent',
		perfilProfissionalComponent           : 'pages/profissionais/perfilProfissionalComponent',
		servicosComponent                     : 'pages/servicos/servicosComponent',
		servicosFormComponent                 : 'pages/servicos/form/servicosFormComponent',
		formDadosComponent                    : 'pages/forms/formDadosComponent',
		formEmailComponent                    : 'pages/forms/formEmailComponent',
		formEnderecoComponent                 : 'pages/forms/formEnderecoComponent',
		formSenhaComponent                    : 'pages/forms/formSenhaComponent',


		agendaComponent                       : 'pages/shared/agenda/agendaComponent',
		auth0Component                        : 'pages/shared/auth0/auth0Component',
		datepickerComponent                   : 'pages/shared/datepicker/datepickerComponent',
		momentComponent                       : 'pages/shared/moment/momentComponent',
		maskComponent                         : '../pages/shared/mask/maskComponent',
		swalComponent                         : '../pages/shared/swal/swalComponent',
		maskComponentForm                     : '../../pages/shared/mask/maskComponent',
		swalComponentForm                     : '../../pages/shared/swal/swalComponent',

    // Templates
		headerTemplate                       : 'pages/header/headerTemplate.html',
		socialAuthTemplate                   : 'pages/socialAuth/socialAuthTemplate.html',
		atendimentosFormTemplate             : 'pages/atendimentos/form/atendimentosFormTemplate.html',
		atendimentoModalTemplate             : 'pages/atendimentos/form/atendimentoModalTemplate.html',
		clientesFormTemplate                 : 'pages/clientes/form/clientesFormTemplate.html',
		agendaClienteTemplate                : 'pages/clientes/agendaClienteTemplate.html',
		perfilClienteTemplate                : 'pages/clientes/perfilClienteTemplate.html',
    homeTemplate                         : 'pages/home/homeTemplate.html',
    loginTemplate                        : 'pages/login/loginTemplate.html',
		dadosHorarioTemplate                 : 'pages/profissionais/form/partials/dadosHorarioTemplate.html',
		dadosProfissionalTemplate            : 'pages/profissionais/form/partials/dadosProfissionalTemplate.html',
		dadosServicoTemplate                 : 'pages/profissionais/form/partials/dadosServicoTemplate.html',
		dadosUsuarioTemplate                 : 'pages/profissionais/form/partials/dadosUsuarioTemplate.html',
		especialidadesFormTemplate           : 'pages/profissionais/form/especialidadesFormTemplate.html',
		profissionaisFormTemplate            : 'pages/profissionais/form/profissionaisFormTemplate.html',
		profissionalAtendimentoModalTemplate : 'pages/profissionais/form/profissionalAtendimentoModalTemplate.html',
		agendaProfissionalTemplate           : 'pages/profissionais/agendaProfissionalTemplate.html',
		especialidadesTemplate               : 'pages/profissionais/especialidadesTemplate.html',
		pesquisaTemplate                     : 'pages/profissionais/pesquisaTemplate.html',
		perfilProfissionalTemplate           : 'pages/profissionais/perfilProfissionalTemplate.html',
		servicosTemplate                     : 'pages/servicos/servicosTemplate.html',
		servicosFormTemplate                 : 'pages/servicos/form/servicosFormTemplate.html',
		formDadosTemplate                    : 'pages/forms/formDadosTemplate.html',
		formEmailTemplate                    : 'pages/forms/formEmailTemplate.html',
		formEnderecoTemplate                 : 'pages/forms/formEnderecoTemplate.html',
		formSenhaTemplate                    : 'pages/forms/formSenhaTemplate.html',
		footerTemplate                       : 'pages/shared/footer.html',


		searchTemplate                       : 'pages/shared/search/searchTemplate.html',

		// frontendComponent                                              : 'pages/frontend/frontendComponent',
		// agendaTemplate : 'pages/frontend/agendaTemplate.html',
		// agendaProfissionalTemplate : 'pages/frontend/agendaProfissionalTemplate.html',
		// agendaClienteTemplate      : 'pages/frontend/agendaClienteTemplate.html',
		// pesquisaTemplate           : 'pages/frontend/pesquisaTemplate.html',
		// perfilTemplate           : 'pages/frontend/perfilTemplate.html',
		// servicosEditTemplate           : 'pages/frontend/servicosListTemplate.html',
		servicosEditTemplate           : 'pages/frontend/servicosEditTemplate.html',
  }

	// Styles

});

require(["app"], function(app) {
  app.init();
});
