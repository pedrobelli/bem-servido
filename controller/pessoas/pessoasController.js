var db             = require('../../models'),
    pessoasManager = require('../../manager/pessoas/pessoasManager');

exports.loadRoutes = function(endpoint, apiRoutes) {
  apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to Bem Servido API!' });
  });

  apiRoutes.get(endpoint + '', function(req, res) {
    return pessoasManager.findAll(req, res);
  });

  apiRoutes.get(endpoint + '/:id', function(req, res) {
    return pessoasManager.find(req, res);
  });

  apiRoutes.delete(endpoint + '/:id', function(req, res) {
    return pessoasManager.destroy(req, res);
  });

  apiRoutes.post(endpoint + '', function(req, res) {
    return pessoasManager.create(req, res);
  });

  apiRoutes.post(endpoint + '/:id', function(req, res) {
    return pessoasManager.update(req, res);
  });
}
