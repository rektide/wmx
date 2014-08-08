var test= require("blue-tape"),
  when= require("when"),
  msgs= require("../../../src/wamp/msgs"),
  cross= require("../../../src/transport/cross-document"),
  arrayWriter= require("../../../src/wamp/array-writer")

var realm= "realm:basic"

test("CrossDocumentPipe sending", function(t){
	var channel = new MessageChannel(),
	  pipe= new cross(channel.port1),
	  details= {special:"bits"},
	  done= when.defer()
	channel.port2.onmessage= function(msg){
		t.equal(msg.data[0], msgs.Hello.messageType, "Hello transmitted")
		t.equal(msg.data[1], realm, "realm transmitted")
		t.deepEqual(msg.data[2], details, "details transmitted")
		done.resolve()
	}

	var hello= new msgs.Hello(realm, details)
	pipe.send(hello)
	return done.promise
})


test("CrossDomainPipe receiving", function(t){
	var channel= new MessageChannel(),
	  pipe= new cross(channel.port1),
	  port2= channel.port2,
	  details= {special:"bits"},
	  done= when.defer()
	pipe.on(msgs.Hello.messageType, function(msg){
		t.ok(msg instanceof msgs.Hello, "a Hello received")
		t.equal(msg.realm, realm, "realm received")
		t.deepEqual(msg.details, details, "details received")
		done.resolve()
	})
	port2.postMessage([msgs.Hello.messageType, realm, details])
	channel.port1.start()
	return done.promise
})
