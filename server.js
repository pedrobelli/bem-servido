'use strict';

var express                = require('express'),
  config                   = require('./config/config'),
  bodyParser               = require('body-parser'),
  db                       = require('./models'),
  // systemSetup              = require('./system/setup'),
  atendimentosController   = require('./controller/atendimentos/atendimentosController'),
  clientesController       = require('./controller/clientes/clientesController'),
  profissionaisController  = require('./controller/profissionais/profissionaisController'),
  especialidadesController = require('./controller/profissionais/especialidadesController'),
  servicosController       = require('./controller/servicos/servicosController');

var path = require('path');
var app = express();
// var args = process.argv;
//
// var drop = args[3] == 'drop' ? true : false;
// var seed = args[4] == 'seed' ? true : false;

// systemSetup.dropTables();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'app'), { maxAge: oneDay }));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

db.sequelize
  .sync()
  // .sync({ force: drop })
  .then(function () {
    app.listen(config.port, function () {
      loadRoutes();

      console.log('Listening on http://localhost:%s', config.port);
    });
  }).catch(function (e) {
      throw new Error(e);
  });

function loadRoutes(){
  var apiRoutes = express.Router();

  atendimentosController.loadRoutes("/atendimentos", apiRoutes);

  clientesController.loadRoutes("/clientes", apiRoutes);

  profissionaisController.loadRoutes("/profissionais", apiRoutes);
  especialidadesController.loadRoutes("/especialidades", apiRoutes);

  servicosController.loadRoutes("/servicos", apiRoutes);

  app.use('/api', apiRoutes);

}
