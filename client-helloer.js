var util= require('util')
var when= require('when')
var abortSnoop= require('./abort-snoop'),
  pipeline2= require('./_pipeline2'),
  wamp= require('./wamp/msgs')

// modes: maintain only one session, report all
function ClientHelloer(pipe, realm, roles){
	ClientHelloer.super_.call(this)
	var self = this
	this.realm = realm || ''
	this.roles = roles || {caller:{}}
	this._hello= [this.realmGenerator, this.clientRoleGenerator]
	this._session= []

	// completion handlers for hello-sender, after _hello
	this._helloOk = function(ctx){
		ctx.pipe.send(new wamp.Hello(ctx.realm, ctx.details))
	}
	// if the _hello pipeline fails:
	this._helloFail = function(ctx){
		self.emit('badhello', ctx)
	}

	// snoop on abort events send out on pipe
	this._abortSnoop= abortSnoop(this, true)

	// completions for sessionizer
	function _sessionOk(ctx){
		self.emit('welcome', ctx)
	}
	function _sessionAbort(ctx){
		self.emit('abort', ctx)
	}

	// sessionizer: listen for replying welcome, emit session
	function _sessionizer(welcome){
		if(welcome instanceof wamp.Abort){
			var ctx= {abort:welcome, clientAbort: false}
			self.emit('abort', ctx)
			return
		}
		if(!(welcome instanceof wamp.Welcome)){
			return
		}
		var ctx= {welcome:welcome, pipe:this}
		pipeline2(self._session, self, ctx).then(_sessionOk, _sessionAbort)
	}
	_sessionizer.owner= this
	this._sessionizer= _sessionizer

	// add pipe
	if(pipe)
		this.addPipe(pipe)
}
util.inherits(ClientHelloer, events.EventEmiter)

ClientHelloer.prototype.addPipe= function(pipe){
	// listen for our Welcomes
	pipe.addEventListener('message', this._sessionizer)

	// snoop on abort events sent ut on pipe
	this._abortSnoop.addPipe(pipe)

	// send a hello
	var ctx= {realm:null, roles:{}, pipe:pipe}
	pipeline2(this._hello, this, ctx).then(this._helloOk, this._helloFail)
}

ClientHelloer.prototype.removePipe= function(pipe){
	// clear sessionizer
	pipe.removeEventListener('message', this._sessionizer)
	// clear out abortSnoops
	this._abortSnoop.removePipe(pipe)
}

function realmGenerator(ctx){
	ctx.realm= this.realm
}
realmGenerator.owner= ClientHelloer
ClientHelloer.prototype.realmGenerator= realmGenerator

function clientRoleGenerator(ctx){
	ctx.roles= this.roles
}
ClientHelloer.prototype.clientRoleGenerator= clientRoleGenerator

module.exports= ClientHelloer
