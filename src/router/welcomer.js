var events= require('events'),
  util= require('util')
var abortSnoop= require('../util/abort-snoop'),
  makePipeline= require('../util/make-pipeline'),
  wamp= require('../wamp/msgs')

var MAX_SAFE_INT= Math.pow(2, 53)

function ingest(hello){
	return {hello: hello}
}

function validateRealm(ctx){
	if(this.realm && !hello.realm || hello.realm != this.realm){
		ctx.details= {message: 'The realm does not exist'}
		ctx.reason= 'wm.missing_realm'
		ctx.messageType= msgs.Abort.messageType
		return ctx
	}
}

function validateRole(ctx){
	if (ctx.messageType) return ctx
	var roles= hello.details && hello.details.roles,
	  reciprocalRoles= Roles.findReciprocal(this.roles, roles)
	if(!reciprocalRoles){
		ctx.details= {message: 'No valid roles founds'}
		ctx.reason= 'wm.missing_role'
		ctx.error= true
		return ctx
	}

	ctx.details = ctx.details|| {}
	ctx.details.roles= ctx.details.roles|| {}
	for(var i in reciprocalRoles)
		ctx.details.roles[reciprocalRoles[i]] = {}
	return ctx;	
}

function generateSession(ctx){
	ctx.session= Math.floor(Math.random()*MAX_INT)
	return ctx
}

function sendWelcome(ctx){
	ctx.messageType = ctx.messageType|| msgs.Welcome.messageType
	this.emit(ctx.messageType, ctx)
}

function RouterWelcomer(options, pipe){
	RouterWelcomer.super_.call(this)
	var self= this

	this.realm= options.realm||null
	this.roless= options.realm||roles.dealer

	this.welcome = makePipeline(this, ingest, validateRealm, validateRole, generateSession, sendWelcome) 

	// snoop on abort events sent out on the pipe
	this._abortSnoop= abortSnoop(this)

	if(pipe)
		this.addPipe(pipe)
}
util.inherits(RouterWelcomer, events.EventEmitter)

RouterWelcomer.prototype.addPipe= function(pipe){
	// welcome incoming helloes
	pipe.addEventListener(msgs.Hello.messageType, this.welcome)

	// snoop on abort events sent ut on pipe
	this._abortSnoop.addPipe(pipe)
}

RouterWelcomer.prototype.removePipe= function(pipe){
	pipe.removeEventListener(msgs.Hello.messageType, this.welcome)
	this._abortSnoop.removePipe(pipe)
}

module.exports= RouterWelcomer
