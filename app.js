/**
 * Module dependencies.
 */
 require('newrelic');
var config = require('config');
var express = require('express');
var RasterizerService = require('./lib/rasterizerService');
var FileCleanerService = require('./lib/fileCleanerService');

process.on('uncaughtException', function (err) {
  console.error("[uncaughtException]", err);
  process.exit(1);
});

process.on('SIGTERM', function () {
  process.exit(0);
});

process.on('SIGINT', function () {
  process.exit(0);
});

// web service
var app = express();

app.use(express.static(__dirname + '/public'))
app.use(app.router);
app.set('rasterizerService', new RasterizerService(config.rasterizer).startService());
app.set('fileCleanerService', new FileCleanerService(config.cache.lifetime));

if (app.get('env') == 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
};

require('./routes')(app, config.server.useCors);
var port = process.env.PORT || config.server.port || 3000;
app.listen(port);
console.log('Express server listening on port ' + port);
