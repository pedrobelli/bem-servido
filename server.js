'use strict';

var express                 = require('express'),
  bodyParser                = require('body-parser'),
  models                    = require('./models'),
  systemSeed                = require('./system/seed'),
  config                    = require('./config/config'),
  agendamentosController    = require('./controller/agendamentos/agendamentosController'),
  qualificacoesController   = require('./controller/agendamentos/qualificacoesController'),
  clientesController        = require('./controller/clientes/clientesController'),
  enderecosController       = require('./controller/enderecos/enderecosController'),
  profissionaisController   = require('./controller/profissionais/profissionaisController'),
  habilidadesController  = require('./controller/profissionais/habilidadesController'),
  horasTrabalhoController   = require('./controller/profissionais/horasTrabalhoController'),
  servicosController        = require('./controller/servicos/servicosController'),
  detalheServicosController = require('./controller/servicos/detalheServicosController');

var path = require('path');
var app = express();
var args = process.argv;

var drop = args[3] == 'drop' ? true : false;
var seed = args[4] == 'seed' ? true : false;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'app'), { maxAge: oneDay }));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

models.sequelize
.sync({ force: drop })
.then(function() {
  if (!seed)
    return Promise.resolve("");

  return systemSeed.runSeed();
})
.then(function() {
  app.listen(config.port, function() {
    loadRoutes();

    console.log('Listening on http://localhost:%s', config.port);
  });
})
.catch(function(e) {
    throw new Error(e);
});

function loadRoutes() {
  var apiRoutes = express.Router();

  agendamentosController.loadRoutes("/agendamentos", apiRoutes);
  qualificacoesController.loadRoutes("/qualificacoes", apiRoutes);

  clientesController.loadRoutes("/clientes", apiRoutes);

  enderecosController.loadRoutes("/enderecos", apiRoutes);

  profissionaisController.loadRoutes("/profissionais", apiRoutes);
  habilidadesController.loadRoutes("/habilidades", apiRoutes);
  horasTrabalhoController.loadRoutes("/horas_trabalho", apiRoutes);

  servicosController.loadRoutes("/servicos", apiRoutes);
  detalheServicosController.loadRoutes("/detalhe_servicos", apiRoutes);

  app.use('/api', apiRoutes);

}
