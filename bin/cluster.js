var debug = require('debug')('microblog-git');
var cluster = require('cluster');
var os = require('os');

var numCPUS = os.cpus().length;

var workers = {};

if(cluster.ismaster){
    cluster.on('death',function(worker){
        delete workers[worker.pid];
        workers[worker.pid] = worker;

    });

    for(var i = 0;i< numCPUS;i++){
        var worker = cluster.fork();
        workers[worker.pid] = worker;
    }
}else{
    var app = require('../app');
    app.listen(3000, function() {
        debug('Cluster server listening on port 3000');
    });
}

process.on('SIGTERM',function(){
    for( var pid in workers){
        process.kill(pid);
    }

    process.exit(0);

});
