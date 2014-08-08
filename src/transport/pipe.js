var events= require('events'),
  util= require('util')
var makePipeline= require('../util/make-pipeline')

module.exports = Pipe

/**
  Emit a message, by it's `messageType` if it has one, else as 'message'.
*/
function emitReceived(e){
	if(e){
		var name = e.messageType || 'message'
		this.emit(name, e)
	}
	return e
}

/**
  Pipe is an abstract base class that sets up:
  1. A send method to send data into a pipe (backed by a _send pipeline)
  2. A recv pipeline a concrete implementation uses to emit messages
*/
function Pipe(){
	Pipe.super_.call(this)
	makePipeline(this, 'send') // application sending data into pipe
	makePipeline(this, 'recv', emitReceived) // receive data from pipe
	return this
}
util.inherits(Pipe, events.EventEmitter)
