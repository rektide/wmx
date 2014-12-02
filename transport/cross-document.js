var util= require('util')
var arrayReader= require('../wamp/array-reader'),
  arrayWriter= require('../wamp/array-writer'),
  Pipe= require('./pipe')

module.exports = CrossDocumentPipe

function messageReader(e){
	if(e && e.currentTarget && e.data.length){
		var msg = arrayReader(e.data)
		msg.pipe = e.currentTarget
		return msg
	} else {
		return e
	}
}

/**
  Implements a pipe on a postMessage/message-eventTarget capable pipe
*/
function CrossDocumentPipe(pipe){
	CrossDocumentPipe.super_.call(this)

	function postMessage(msg){
		if(msg)
			pipe.postMessage(msg)
	}
	// encode, then postMessage a 'send' message
	this._send.push(arrayWriter, postMessage)

	// decode _recv messages
	this._recv.unshift(messageReader)

	// take network messages and execute them against _recv
	pipe.addEventListener('message', this.recv);

	return this
}
util.inherits(CrossDocumentPipe, Pipe)
