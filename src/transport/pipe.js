var events= require('events'),
  util= require('util')
var when= require('when'),
  pipeline= require('when/pipeline')

var _emit= events.EventEmitter.prototype.emit

/**
  Pipe is an EventEmitter that also has a 'send' method to transmit.
  This is a base class, setting up _send/_recv command-chains that
  higher order classes compose on
*/
function Pipe(){
	Pipe.super_.call(this)

	// messages coming out of the pipe will be emitted
	// here provide a base _recv handler that forwards messages as local events
	var self = this
	function recv(ev){
		var name = ev.messageType ? ev.messageType : 'message'
		_emit.call(self, name, ev)
	}
	recv.owner= this

	this._send = [] // application sending data
	this._recv = [recv] // receive event from network
	return this
}
util.inherits(Pipe, events.EventEmitter)

/**
  Send messages into the pipe
*/
function send(data){
	pipeline(this._send, data)
}
send.owner= Pipe
Pipe.prototype.send= send

module.exports = Pipe
