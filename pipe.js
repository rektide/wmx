var events= require('events'),
  util= require('util'),
  when= require('when'),
  cc= require('ex-cathedra/chain')

var _emit= events.EventEmitter.prototype.emit

/**
  Pipe is an EventEmitter that also has a 'send' method to transmit.
  This is a base class, setting up _send/_recv command-chains that
  higher order classes compose on
*/
function Pipe(){
	this._send = new chain() // application sending data cc
	this._recv = new chain() // receive event from network cc

	Pipe.super_.call(this)

	// provide a stock _recv handler that forwards messages as local events
	var self = this
	function recv(ev){
		_emit.call(self, 'message', ev)
	}
	recv.owner= Pipe
	this._recv.cc.push(recv)

	// send calls into the _send chain
	function send(data){
		self._send.exec(data)
	}
	send.owner = Pipe
	this.send= send

	return this
}
util.inherits(Pipe, events.EventEmitter)

module.exports = Pipe
