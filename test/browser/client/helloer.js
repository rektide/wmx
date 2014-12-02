"use strict";

var test= require('blue-tape'),
  when= require('when')
var arrayReader= require('wmx/wamp/array-reader'),
  msgs= require('wmx/wamp/msgs'),
  cross= require('wmx/transport/cross-document'),
  helloer= require('wmx/client/helloer')


var realm= 'helloer_test_realm',
  sessionId= 'helloer_test_session',
  dealer= {
    special: 'bits',
    roles: {
      dealer: {}
  }},
  broker= {
    roles: {
      broker: {}
  }}

test('Helloer', function(t){
	var channel= new MessageChannel(),
	  pipe= new cross(channel.port1),
	  helloer_= new helloer(),
	  sent= when.defer()

	channel.port2.onmessage= function(e){
		var msg= arrayReader(e.data)
		t.ok(msg instanceof msgs.Hello, 'hello received')
		t.ok(msg.details && msg.details.roles, 'hello has roles')
		//t.equal(received.promise.inspect().state, 'pending', 'not yet welcomed')
		channel.port2.postMessage([msgs.Welcome.messageType, sessionId, dealer])
		sent.resolve()
	}
	var welcome = helloer_.sendHello(pipe).then(function(msg){
		t.equal(msg.messageType, msgs.Welcome.messageType, 'welcome reply received')
		t.ok(msg.details && msg.details.roles && msg.details.roles.dealer, 'welcome has dealer role')
	})
	channel.port1.start()
	return when.join(sent.promise, welcome)
})
