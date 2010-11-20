var shob = require('./shob');

var argv = process.argv;

var s = new shob.WebServer(8124, '127.0.0.1');
s.register(argv[2], argv[3], 'http://127.0.0.1:8124/back');