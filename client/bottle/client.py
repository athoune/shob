#!/usr/bin/env python

import xml.etree.ElementTree

import urllib

from bottle import route, run, request

presences = {}

@route('/start/:jid')
def start(jid):
	urllib.urlopen('http://localhost:8124/%s' % jid);
	return 'ok\n'

@route('/xmpp-back', method='POST')
def xmpp():
	body = request.body.read()
	#print body
	stanza = xml.etree.ElementTree.fromstring(body);
	#print stanza.tag
	if stanza.tag == u'{jabber:client}presence':
		presence(stanza)
	if stanza.tag == u'{jabber:client}iq':
		iq(stanza)
	if stanza.tag == u'{jabber:client}message':
		message(stanza)
	return 'ok'

def presence(stanza):
	global presences
	presences[stanza.attrib['from']] = stanza.find('{jabber:client}status').text
	print presences

def stanza(stanza):
	pass

def iq(stanza):
	pass

run(host='localhost', port=8125)
