"use strict"

var tape= require("blue-tape"),
  when= require("when")
var arrayReader= require("wmx/wamp/array-reader"),
  msgs= require("wmx/wamp/msgs"),
  cross= require("wmx/wamp/transport/cross-document"),
  welcomer= require("wmx/wamp/router/welcomer"),
  crossHarness= require("../pipe/cross-document")

module.exports= WelcomerHarness
Object.defineProperty(module.exports, "Harness", {
	get: WelcomerHarness
})

module.exports.realm= "helloer_test_realm"
module.exports.callee= {
  special: "bits",
  roles: {
    callee: {}}}

function WelcomerHarness(harness){
	function details(){
		return harness.details && harness.details !== details ? harness.details : module.exports.callee
	}

	harness= harness|| {}
	if(!harness.details){
		harness.details= details
	}
	harness= crossHarness(harness)
	var realm= harness.realm|| module.exports.realm
	if(typeof(realm) === "function"){
		realm= realm.call(harness)
	}
	harness.welcomer= new welcomer({realm:realm}, harness.pipe)
	return harness
}

tape("Welcomer replies to a raw message", function(t){
	var harness= WelcomerHarness(),
	  sent= when.defer(),
	  received= when.defer()

	harness.channel.port2.onmessage= function(e){
		var welcome = arrayReader(e.data)
		t.ok(welcome instanceof msgs.Welcome, "welcome reply received")
		t.ok(welcome.session, "reply has session")
		t.ok(welcome.details.roles, "reply has roles")
		t.ok(welcome.details.roles.dealer, "reply is dealer")
		t.noOk(welcome.hello, "welcome has no hello")
		sent.resolve()
	}
	
	harness.welcomer.on(msgs.Hello.messageType, function(welcome){
		//t.ok(welcome instanceof msgs.Welcome, "welcome is a welcome")
		t.ok(welcome.messageType, msgs.Welcome.messageType, "welcome emits of welcome messageType")
		t.equal(welcome.session,"welcome emits session")
		t.ok(welcome.details, "welcome emits details")
		t.ok(welcome.details.roles, "welcome emits roles")
		t.ok(welcome.details.roles.dealer, "welcomer emits a dealer")
		t.ok(welcome.hello, "welcomer emits hello")
		received.resolve()
	})

	// welcomer & listener is setup, start welcomer"s port
	harness.postHello()
	return when.join(sent.promise, received.promise)
})
