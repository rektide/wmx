var test= require('blue-tape'),
  when= require('when')
var arrayReader= require('../../../src/wamp/array-reader'),
  msgs= require('../../../src/wamp/msgs'),
  cross= require('../../../src/transport/cross-document'),
  helloer= require('../../../src/client/helloer')

var realm= 'helloer_test_realm',
  sessionId= 'helloer_test_session',
  details= {
     special: 'bits',
	role: {
		dealer: {
  }}}

test('Helloer', function(t){
	var channel= new MessageChannel(),
	  pipe= new cross(channel.port1)
	  helloer= new helloer(),
	  sent= when.defer()

	channel.port2.onmessage= function(e){
		var msg= arrayReader(e.data)
		t.ok(msg instanceof msgs.Hello, 'hello received')
		//t.equal(received.promise.inspect().state, 'pending', 'not yet welcomed')
		channel.port2.postMessage([msgs.Welcome.messageType, sessionId, details])
		sent.resolve()
	}
	var welcome = helloer.sendHello(pipe).then(function(msg){
		t.equal(msg.messageType, msgs.Welcome.messageType, 'welcome reply received')
	})
	channel.port1.start()
	return when.join(sent.promise, welcome)
})
