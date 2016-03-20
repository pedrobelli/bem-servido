'use strict';

var express  = require('express'),
  config     = require('./config/config'),
  bodyParser = require('body-parser'),
  morgan     = require('morgan'),
  db         = require('./models'),
  pessoasController    = require('./controller/pessoas/pessoasController');

var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'app'), { maxAge: oneDay }));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

db.sequelize
  .sync()
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

  pessoasController.loadRoutes("/pessoas", apiRoutes);

  app.use('/api', apiRoutes);

}
