#!/usr/bin/env python
from bottle import route, run, request

@route('/xmpp-back', method='POST')
def xmpp():
	print request.body.read()
	return 'ok'

run(host='localhost', port=8125)