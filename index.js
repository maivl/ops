var util = require('util');
var path = require('path');
var cluster = require("cluster");
var logger = require("./utils/logger");
var config = require('./utils/config'); 

var workerpath = path.join(__dirname, 'worker.js');
var restartTime = 5000;

cluster.setupMaster({
    exec : workerpath
});

cluster.on('fork', function (worker) {
    console.log('[%s] [worker:%d] new worker start', new Date(), worker.process.pid);
});

cluster.on('exit', function (worker, code, signal) {
    var exitCode = worker.process.exitCode;
    var err = new Error(util.format('worker %s died (code: %s, signal: %s)', worker.process.pid, exitCode, signal));
    err.name = 'WorkerDiedError';
    //if("production" === config.env){
        setTimeout(function () {
            cluster.fork();
        }, restartTime);
    //}
});

var numCPUs = require('os').cpus().length;
for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
}