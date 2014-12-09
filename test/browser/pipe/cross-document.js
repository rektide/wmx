"use strict"

var tape= require("blue-tape"),
  when= require("when"),
  msgs= require("wmx/wamp/msgs"),
  cross= require("wmx/wamp/transport/cross-document"),
  arrayWriter= require("wmx/wamp/array-writer")

module.exports= CrossDocumentHarness
Object.defineProperty(module.exports, "Harness", {
	get: CrossDocumentHarness
})

module.exports.realm= "realm:basic"
module.exports.details= {special:"bits"}

function CrossDocumentHarness(harness){
	harness= harness|| {}
	harness.channel= harness.channel|| new MessageChannel()
	harness.pipe= harness.pipe|| new cross(harness.channel.port1)
	harness.postHello= postHello
	function postHello(){
		var realm= harness.realm|| module.exports.realm
		var details = harness.details|| module.exports.details
		if(typeof(realm) === "function"){
			realm= realm.call(harness)
		}
		if(typeof(details) === "function"){
			details= details.call(harness)
		}
		var message= [msgs.Hello.messageType, realm, details]
		harness.channel.port2.postMessage(message)
	}
	if(!harness.noStart)
		process.nextTick(function(){
			if(!harness.noStart)
				harness.channel.port1.start()
		})
	harness.channel.port1.start()
	return harness
}

tape("CrossDocumentPipe sending", function(t){
	var harness= CrossDocumentHarness(),
	  done= when.defer()
	harness.channel.port2.onmessage= function(msg){
		t.equal(msg.data[0], msgs.Hello.messageType, "Hello transmitted")
		t.equal(msg.data[1], module.exports.realm, "realm transmitted")
		t.deepEqual(msg.data[2], module.exports.details, "details transmitted")
		done.resolve()
	}

	var hello = new msgs.Hello(module.exports.realm, module.exports.details)
	harness.pipe.send(hello)
	return done.promise
})


tape("CrossDomainPipe receiving", function(t){
	var harness= CrossDocumentHarness(),
	  done= when.defer()
	harness.pipe.on(msgs.Hello.messageType, function(msg){
		t.ok(msg instanceof msgs.Hello, "a Hello received")
		t.equal(msg.realm, module.exports.realm, "realm received")
		t.deepEqual(msg.details, module.exports.details, "details received")
		done.resolve()
	})
	harness.postHello()
	return done.promise
})
