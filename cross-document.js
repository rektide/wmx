var util= require('util')
var cloneFunction= require('clone-function')
var arrayReader= require('./wamp/arrayReader'),
  arrayWriter= require('./wamp/arrayWriter'),
  Pipe= require('./pipe')

/**
  Implements a pipe on a postMessage/message-eventTarget capable pipe
*/
function CrossDocumentPipe(pipe){
	CrossDocument.super_.call(this)

	var _arrayWriter= cloneFunction(arrayWriter),
	  _arrayReader= cloneFunction(arrayReader)
	_arrayWriter.owner= this
	_arrayReader.owner= this

	function postMessage(msg){
		pipe.postMessage(msg)
	}
	postMessage.owner= this
	// encode a 'send' message
	// postMessage a 'send' message
	this._send.push(arrayWriter, postMessage)

	// decode _recv messages
	this._recv.unshift(arrayReader)

	// take network messages and execute them against _recv
	var _recv= this._recv
	function recv(ev){
		when.pipeline(_recv, ev)
	}
	recv.owner= this
	pipe.addEventListener('message', recv);

	return this
}
util.inherits(CrossDocumentPipe, Pipe)

module.exports = CrossDocumentPipe
