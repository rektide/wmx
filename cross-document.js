var util= require('util')
var arrayReader= require('./wamp/arrayReader'),
  arrayWriter= require('./wamp/arrayWriter'),
  Pipe= require('./pipe')

/**
  Implements a pipe on a postMessage/message-eventTarget capable pipe
*/
function CrossDocumentPipe(pipe){
	CrossDocument.super_.call(this)
	this.pipe= pipe

	// push 'send' messages onto the pipe
	function send(data){
		var msg = arrayWriter(data)
		pipe.postMessage(msg) // origin?
	}
	send.owner= this
	this._send.cc.push(send)

	// take network messages and execute them against _recv
	var self= this
	function recv(ev){
		var msg= arrayReader(ev.data)
		self._recv.exec(msg)
	}
	recv.owner = this
	pipe.addEventListener('message', recv);

	return this
}
util.inherits(CrossDocumentPipe, Pipe)

module.exports = CrossDocumentPipe
