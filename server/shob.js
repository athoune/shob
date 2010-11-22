var url = require('url'),
	http = require('http'),
	xmpp = require('node-xmpp'),
	util = require('util');

function Shob(jid, pwd, urlback, cb) {
	var u = url.parse(urlback);
	var back = http.createClient(u.port, u.hostname);
	var cl = new xmpp.Client({jid: jid + '/shob', password: pwd});
	cl.on('error',
		function(e) {
			util.puts(e);
		});
	cl.on('online',
		function() {
			cl.send(new xmpp.Element('presence',{}));
			cb.apply(this);
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


function WebServer(port, ip) {
	var jids = {};
	this.jids = jids;
	this.httpd = http.createServer(function (req, res) {
		var u = url.parse(req.url);
		var data = '';
		req.on('data', function(chunk) {
			data += chunk;
		});
		req.on('end', function() {
			console.log(data);
			var jid = u.pathname.split('/')[1];
			console.log(jids);
			if(jids[jid] == null) {
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.end('not a user\n');
			} else {
				if(jids[jid].shob == null) {
					jids[jid].shob = new Shob(jids[jid].jid, jids[jid].pwd, jids[jid].url, function() {
						console.log(jids[jid].jid + ' is online');
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end('');
					});
				} else {
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end('Hello World\n');
				}
			}
		});
	});
	this.httpd.listen(port, ip);
	console.log('Server running at http://' + ip + ':' + port);
}

exports.WebServer = WebServer;

WebServer.prototype.register = function(jid, pwd, url) {
	this.jids[jid] = {jid: jid, pwd: pwd, url: url};
};
