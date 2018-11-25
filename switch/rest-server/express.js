/**
 * Module dependencies.
 */
var express = require('express'),
    api = require('./routes/api'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator');
var app = express();
var server = require('http').createServer(app);

app.use(expressValidator({
  customValidators: {
    lessThanOrEqual: function(param, num) {
      return param >= 0 && param <= num;
    }
  }
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.put('/api/device/:systemCode/:unitCode', api.changeState);
app.get('/api/device/:systemCode/:unitCode', api.getDeviceState);

exports = module.exports = server;

exports.use = function() {
  app.use.apply(app, arguments);
};

exports.express = express;

// Start server
app.listen(9876);
console.log("Server running at http://127.0.0.1:9876/");
