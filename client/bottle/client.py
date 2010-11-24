#!/usr/bin/env python

import xml.etree.ElementTree

import urllib

from bottle import route, run, request, debug

debug(True)

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
	f = stanza.find('{jabber:client}status')
	if f != None:
		presences[stanza.attrib['from']] = f.text
	print presences

def message(stanza):
	print stanza

def iq(stanza):
	pass

run(host='localhost', port=8125)
