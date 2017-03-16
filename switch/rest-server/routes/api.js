//execute commands
var util = require('util');
var exec = require('child_process').exec;
var sleep = require('sleep');

//Shell Client
// homepi <id> <command>
// homepi 0 ON --> curl -i -X PUT -H 'Content-Type: application/json' -d '{"state": "on"}' http://raspberrypi:8080/devices/0

var deviceStates = [];

// PUT (idempotent changes)
exports.changeState = function (req, res) {
  req.checkParams('command', 'Invalid command').notEmpty().isInt().lessThanOrEqual(1);
  // Check body for systemCode and unitCode.
  req.checkBody('systemCode', 'Invalid systemCode').notEmpty().isInt().lessThanOrEqual(4);
  req.checkBody('unitCode', 'Invalid systemCode').notEmpty().isInt().lessThanOrEqual(4);

  console.log('gotRequest');
  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      console.log('Error:' + util.inspect(result.array()));
      res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
      return;
    }
    executeRcSend(req.body.systemCode, req.body.unitCode, req.params.command);
    registerDeviceState(req.body.systemCode, req.body.unitCode, req.params.command);
    res.json({ message: 'Ok.' });
    return;
  });
};

exports.getDeviceState = function (req, res) {
  // Check body for systemCode and unitCode.
  req.checkBody('systemCode', 'Invalid systemCode').notEmpty().isInt().lessThanOrEqual(4);
  req.checkBody('unitCode', 'Invalid systemCode').notEmpty().isInt().lessThanOrEqual(4);

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
      return;
    }
    res.json({ message: returndeviceState(req.body.systemCode, req.body.unitCode) });
    return;
  });
};

function returndeviceState(systemCode, unitCode) {
  if (typeof deviceStates[systemCode] === 'undefined') {
    return 'unknown';
  }
  if (typeof deviceStates[systemCode][unitCode] === 'undefined') {
    return 'unknown';
  }
  return deviceStates[systemCode][unitCode];
}

function registerDeviceState(systemCode, unitCode, command) {
  if (typeof deviceStates === 'undefined') {
    deviceStates = {};
  }
  if (typeof deviceStates[systemCode] === 'undefined') {
    deviceStates[systemCode] = {};
  }
  deviceStates[systemCode][unitCode] = command;
}

function executeRcSend(systemCode, unitCode, command) {
  var execute = "rc-send ";
  var args = [systemCode, unitCode, command];
  execute += args.join(' ');
  executeShellCommand(execute);
}

function executeShellCommand(command){
    console.log("Executing command: " + command);
    exec(command, puts);
    sleep.sleep(1);//sleep for 1 seconds
}

function puts(error, stdout, stderr) {
        console.warn("Executing Done");
}
