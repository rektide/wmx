var events= require('events'),
  util= require('util')
var abortSnoop= require('../util/abort-snoop'),
  makePipeline= require('../util/make-pipeline'),
  msgs= require('../wamp/msgs')

module.exports= ClientHelloer

/**
  Assign default elements to the hello
*/
function helloDefaults(hello){
	hello.realm= this.realm
	hello.details.roles= this.roles
	return hello
}

/**
  Send the hello
*/
function sendHello(hello){
	var msg= new msgs.Hello(hello.realm, hello.details)
	hello.pipe.send(msg)
	return hello
}

/**
  Forward along/emit a returning welcome
*/
function welcomed(welcome){
	this.emit(msgs.Welcome.messageType, welcome)
}

// modes: maintain only one session, report all
function ClientHelloer(pipe, realm, roles){
	ClientHelloer.super_.call(this)
	var self = this
	this.realm = realm || ''
	this.roles = roles || {caller:{}}

	makePipeline(this, 'hello', helloDefaults, sendHello)
	makePipeline(this, 'welcomer', welcomed)

	// snoop on abort events send out on pipe
	this._abortSnoop= abortSnoop(this, true)

	// add pipe
	if(pipe)
		this.addPipe(pipe)
}
util.inherits(ClientHelloer, events.EventEmitter)

ClientHelloer.prototype.addPipe= function(pipe){
	// listen for our Welcomes
	pipe.addListener(msgs.Welcome.messageType, this.welcomer)

	// snoop on abort events sent out on pipe
	this._abortSnoop.addPipe(pipe)

	// send a hello
	var helloMsg= {realm:null, details:{}, pipe:pipe}
	this.hello(helloMsg)
}

ClientHelloer.prototype.removePipe= function(pipe){
	pipe.removeListener(msgs.Welcome.messageType, this.welcomer)

	// clear out abortSnoops
	this._abortSnoop.removePipe(pipe)
}
