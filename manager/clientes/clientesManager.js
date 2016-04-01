var db = require('../../models');

exports.findAll = function(req, res) {
  db.clientes.findAll().then(function(entities) {
    res.json({clientes: entities})
  })
}

exports.find = function(req, res) {
  db.clientes.find({ where: { id: req.param('id') } }).then(function(entity) {
    if (entity) {
      res.json({cliente: entity})
    } else {
      res.send(404)
    }
  })
}

exports.create = function(req, res) {
  db.clientes.create(req.body).then(function(entity) {
    res.statusCode = 201
    res.json(entity)
  })
}

exports.update = function(req, res) {
  db.clientes.find({ where: { id: req.param('id') } }).then(function(entity) {
    if (entity) {
      entity.updateAttributes(req.body).then(function(entity) {
        res.json(entity)
      })
    } else {
      res.send(404)
    }
  })
}

exports.destroy = function(req, res) {
  db.clientes.find({ where: { id: req.param('id') } }).then(function(entity) {
    if (entity) {
      entity.destroy().then(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}
