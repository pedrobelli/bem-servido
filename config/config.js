var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

require('dotenv').load();

var config = {
  development: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.SERVER_PORT,
    secret: 'abc',
    db: 'mysql://' + process.env.MYSQL_USER + ':' + process.env.MYSQL_PASS + '@' + process.env.MYSQL_HOST + ':' + process.env.MYSQL_PORT + '/' + process.env.APP_NAME + '_development'
  },

  test: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.SERVER_PORT,
    secret: 'abc',
    db: 'mysql://' + process.env.MYSQL_USER + ':' + process.env.MYSQL_PASS + '@' + process.env.MYSQL_HOST + ':' + process.env.MYSQL_PORT + '/' + process.env.APP_NAME + '_test'
  },

  production: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.SERVER_PORT,
    secret: 'abc',
    db: 'mysql://' + process.env.MYSQL_USER + ':' + process.env.MYSQL_PASS + '@' + process.env.MYSQL_HOST + ':' + process.env.MYSQL_PORT + '/' + process.env.APP_NAME + '_production'
  }
};

module.exports = config[env];
