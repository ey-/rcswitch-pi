/**
 * Module dependencies.
 */
var request = require('request');
var util = require('util');
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-eyRcSwitch", "eyRcSwitch", EyRcSwitch);
};

function EyRcSwitch(log, config) {
  this.log = log;
  this.name = config["name"];
  this.host = config["host"];
  this.port = config["port"];
  this.systemCode = config["systemCode"];
  this.id = this.unitCode = config["id"];
}

EyRcSwitch.prototype = {
  setPowerState: function(powerOn, callback) {
    var on = powerOn ? '1' : '0';
    console.log('received setPowerState');
    req = {
      method: "PUT",
      url: this.host + ':' + this.port + '/api/device/' + on ,
      json: {
        systemCode: this.systemCode,
        unitCode: this.unitCode
      }
    };
    console.log('sending Request to:' + util.inspect(req));
    request(req, function(error, request, body) {
      console.log('gotError:' + util.inspect(error));
      console.log('was Request:' + util.inspect(request));
      console.log('got body:' + util.inspect(body));
      callback();
    });
  },

  getServices: function() {
    var switchService = new Service.Switch(this.name);
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Engin')
      .setCharacteristic(Characteristic.Model, this.name)
      .setCharacteristic(Characteristic.SerialNumber, this.name);

    switchService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));

    return [informationService, switchService];
  }
};

