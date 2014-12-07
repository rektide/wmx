var _= require('lodash'),
  events= require('events'),
  util= require('util')
var abortSnoop= require('../util/abort-snoop'),
  makePipeline= require('../util/make-pipeline'),
  wamp= require('../wamp/msgs'),
  roles= require('../wamp/roles')

var MAX_SAFE_INT= Math.pow(2, 53)

function ingest(hello, pipe){
	var details= _.clone(this.details|| {})
	return {hello: hello, pipe: pipe, details: details}
}

function validateRealm(ctx){
	if (ctx.messageType) return ctx
	if(this.realm && !ctx.hello.realm || ctx.hello.realm != this.realm){
		ctx.details= {message: 'The realm does not exist'}
		ctx.reason= 'wm.missing_realm'
		ctx.messageType= msgs.Abort.messageType
		return ctx
	}
	ctx.details.realm= this.realm
	return ctx
}

function validateRole(ctx){
	if (ctx.messageType) return ctx
	var roles= ctx.hello.details && ctx.hello.details.roles
	if(roles.dealer || roles.broker) {
		ctx.details= {message: 'Invalid Router roles found in Hello'}
		ctx.reason= 'wm.bad_role'
		ctx.error= true
		return ctx
	}
	if(!(roles.callee || roles.caller)){
		ctx.details= {message: 'No valid roles founds'}
		ctx.reason= 'wm.missing_role'
		ctx.error= true
		return ctx
	}

	ctx.details.roles= this.roles
	return ctx;	
}

function generateSession(ctx){
	ctx.session= Math.floor(Math.random()*MAX_SAFE_INT)
	return ctx
}

function sendWelcome(ctx){
	ctx.messageType = ctx.messageType|| msgs.Welcome.messageType

	// send reply welcome on pipe
	var hello= ctx.hello,
	  pipe= ctx.pipe
	ctx.hello= undefined
	ctx.pipe= undefined
	pipe.send(ctx)

	// relay out welcome event - sans pipe
	ctx.hello= hello
	this.emit(ctx.messageType, ctx)
	return ctx
}

function RouterWelcomer(options, pipe){
	RouterWelcomer.super_.call(this)
	var self= this

	this.realm= options.realm||null
	this.roles= options.roles||{dealer:{}}

	makePipeline(this, 'welcome', ingest, validateRealm, validateRole, generateSession, sendWelcome) 

	// snoop on abort events sent out on the pipe
	this._abortSnoop= abortSnoop(this)

	if(pipe)
		this.addPipe(pipe)
	return this
}
util.inherits(RouterWelcomer, events.EventEmitter)

RouterWelcomer.prototype.addPipe= function(pipe){
	// welcome incoming helloes
	pipe.on(msgs.Hello.messageType, this.welcome)

	// snoop on abort events sent ut on pipe
	this._abortSnoop.addPipe(pipe)
}

RouterWelcomer.prototype.removePipe= function(pipe){
	pipe.removeEventListener(msgs.Hello.messageType, this.welcome)
	this._abortSnoop.removePipe(pipe)
}

module.exports= RouterWelcomer
