var url = require('url'),
	http = require('http'),
	xmpp = require('node-xmpp'),
	util = require('util');

function WebServer(port, ip) {
	this.jids = {};
	this.httpd = http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello World\n');
	});
	this.httpd.listen(port, ip);
	console.log('Server running at http://' + ip + ':' + port);
}

exports.WebServer = WebServer;

function Shob(jid, pwd, urlback) {
	var u = url.parse(urlback);
	var back = http.createClient(u.port, u.hostname);
	var cl = new xmpp.Client({jid: jid + '/shob', password: pwd});
	cl.on('error',
		function(e) {
			util.puts(e);
		});
	cl.on('online',
		function() {
			cl.send(new xmpp.Element('presence',{})
			);
		});
	cl.on('stanza',
		function(stanza) {
			util.debug(stanza.name);
			util.debug(stanza);
			var st = stanza.toString();
			var request = back.request('POST', u.pathname, {'Content-Length' : st.length});
			request.on('response', function(response) {
				var buff = '';
				response.on('data', function(chunk) {
					buff += chunk;
				});
				response.on('end', function() {
					console.log(buff);
				});
			});
			request.write(st);
			request.end();
		});
}

WebServer.prototype.register = function(jid, pwd, url) {
	this.jids[jid] = new Shob(jid, pwd, url);
};
