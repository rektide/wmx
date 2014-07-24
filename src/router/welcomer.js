var events= require('events'),
  util= require('util')
var when= require('when')
var abortSnoop= require('./abort-snoop'),
  pipeline2= require('./_pipeline2'),
  wamp= require('./wamp/msgs')

function RouterWelcomer(pipe, sessionGenerator){
	RouterWelcomer.super_.call(this)
	var self= this
	this._welcome= [this.sessionGenerator, this.routerRoleGenerator]

	// completions for welcomer
	function _welcomerOk(ctx){
		ctx.pipe.emit('welcome', new wamp.Welcome(ctx.session. ctx.roles))
		self.emit('welcome', ctx)
	}
	function _welcomeAbort(ctx){
		if(ctx.uri)
			ctx.pipe.emit('abort', new wamp.Abort(ctx.details, ctx.uri))

		ctx.clientAbort= false
		self.emit('abort', ctx)
	}

	// snoop on abort events sent out on the pipe
	this._abortSnoop= abortSnoop(this)

	// process a hello, respond with welcome, emit session
	function _welcomer(hello, pipe){
		if(!(welcome instanceof wamp.Hello))
			return
		var ctx= {session:null, roles:{}, hello:hello, pipe:pipe}
		pipeline2(self._welcome, self, ctx).then(_welcomeOk, _welcomeAbort);
	}
	_welcomer.owner= this
	this._welcomer= _welcomer

	if(pipe)
		this.addPipe(pipe)
}
util.inherits(RouterWelcomer, events.EventEmitter)

RouterWelcomer.prototype.addPipe= function(pipe){
	// welcome incoming helloes
	pipe.addEventListener('message', this._welcomer)

	// snoop on abort events sent ut on pipe
	this._abortSnoop.addPipe(pipe)
}

RouterWelcomer.prototype.removePipe= function(
	pipe.removeEventListener('message', this._welcomer)
	this._abortSnoop.removePipe(pipe)
}

var MAX_INT= Math.pow(2, 53)
function sessionGenerator(ctx){
	ctx.session= Math.floor(Math.random()*MAX_INT)
	return ctx
}
sessionGenerator.owner= RouterWelcomer
RouterWelcomer.prototype.sessoinGenerator= sessionGenerator

var MISSING_ROLES= {details: {message: 'Expected roles'}, uri: 'wm.missing_roles'}
var MISSING_CALLER= {details: {message: 'Expected a caller'}, uri: 'wm.missing_role'}
function routerRoleGenerator(ctx){
	var helloRoles= ctx.hello.roles
	if(!helloRoles)
		throw MISSING_ROLES
	}
	if(typeof helloRoles.caller !== 'object'){
		throw MISSING_CALLER
	}
	ctx.roles.callee= {}
	return ctx
}
routerRoleGenerator.owner= RouterWelcomer
RouterWelcomer.prototype.routerRoleGenerator= routerRoleGenerator

module.exports= RouterWelcomer
