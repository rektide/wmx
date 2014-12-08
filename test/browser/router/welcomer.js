"use strict";

var tape= require('blue-tape'),
  when= require('when')
var arrayReader= require('wmx/wamp/array-reader'),
  msgs= require('wmx/wamp/msgs'),
  cross= require('wmx/wamp/transport/cross-document'),
  welcomer= require('wmx/wamp/router/welcomer')

var realm= 'helloer_test_realm',
  sessionId= 'helloer_test_session',
  callee= {
    special: 'bits',
    roles: {
      callee: {}
  }}

tape('Welcomer replies to a raw message', function(t){
	var channel= new MessageChannel(),
	  pipe= new cross(channel.port1),
	  welcomer_= new welcomer({realm:realm}, pipe),
	  sent= when.defer(),
	  received= when.defer()

	channel.port2.onmessage= function(e){
		var welcome = arrayReader(e.data)
		t.ok(welcome instanceof msgs.Welcome, 'welcome reply received')
		t.ok(welcome.session, 'reply has session')
		t.ok(welcome.details, 'reply has details')
		t.ok(welcome.details.roles, 'reply has roles')
		t.ok(welcome.details.roles.dealer, 'reply is dealer')
		t.ok(!welcome.hello, 'welcome has no hello')
		sent.resolve()
	}
	
	welcomer_.on(msgs.Welcome.messageType, function(welcome){
		//t.ok(welcome instanceof msgs.Welcome, 'welcome is a welcome')
		t.ok(welcome.messageType, msgs.Welcome.messageType, 'welcome emits of welcome messageType')
		t.ok(welcome.session, 'welcome emits session')
		t.ok(welcome.details, 'welcome emits details')
		t.ok(welcome.details.roles, 'welcome emits roles')
		t.ok(welcome.details.roles.dealer, 'welcomer emits a dealer')
		t.ok(welcome.hello, 'welcomer emits hello')
		received.resolve()
	})

	// welcomer & listener is setup, start welcomer's port
	channel.port1.start()
	channel.port2.postMessage([msgs.Hello.messageType, realm, callee])
	return when.join(sent.promise, received.promise)
})
