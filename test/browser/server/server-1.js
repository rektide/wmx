"use strict"

var tape= require("blue-tape")
var http= require("wmx/http-server"),
  Welcomer= require("../router/welcomer"),
  CrossDoc= require("../pipe/cross-document"),
  Request= require("wmx/fetch/request"),
  ArrayWriter= require("wmx/wamp/array-writer")

tape("Server", function(t){

	t.plan(6)
	function ref(){
		t.ok()
	}

	var server= http.createServer(ref)
	server.on("request", ref)
	server.on("request", function(req, res){
		t.equal(req.mesageType, msgs.Call.messageType, "messageType is Call")
		t.equal(req.method, "GET", "method is GET")
		t.equal(req.url, "/ping")
		req.on("data", function(data){
			t.equal(data, "ping!")
			res.end("pong")
		})
		req.setEncoding("utf8")
	});

	var welcomerPair= Welcomer()
	server.listen(welcomerPair.welcomer)

	var request= Request({
		url: "//ping"
	})
	console.log('send:'+Object.keys(request).join(':'))
	var reqArr= ArrayWriter(request);
	console.log('arr:'+JSON.stringify(reqArr));
	welcomerPair.channel.port2.postMessage(request)
	console.log('sent')
})
