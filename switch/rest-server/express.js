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

// Configuration
// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//
//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//       res.send(200);
//     }
//     else {
//       next();
//     }
// };

// app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(methodOverride());
app.put('/api/device/:command', api.changeState);
app.put('/api/device', api.getDeviceState);

exports = module.exports = server;

exports.use = function() {
  app.use.apply(app, arguments);
};

exports.express = express;

// Start server
app.listen(9876);
console.log("Server running at http://127.0.0.1:9876/");
