var tape= require("blue-tape")
var http= require('wmx/http-server'),
  Welcomer= require('../router/welcomer'),
  CrossDoc= require("wmx/test/browser/pipe/cross-document")

tape('Server', function(t){
	//t.end()
	//return
	// ^-- WIP-flags

	t.plan(6)
	function ref(){
		t.ok()
	}

	var server= http.createServer(ref)
	server.on('request', ref)
	server.on('request', function(req, res){
		t.equal(req.mesageType, msgs.Call.messageType, 'messageType is Call')
		t.equal(req.method, 'GET', 'method is GET')
		t.equal(req.url, '/ping')
		req.on('data', function(data){
			t.equal(data, 'ping!')
			res.end('pong')
		})
		req.setEncoding('utf8')
	});

	
	var welcomerPair= Welcomer()
	server.listen(welcomerPair.welcomer)

	var request= Request({
		url: '//ping'
	})
	welcomerPair.port2.postMessage(request)
})
