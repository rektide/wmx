var events= require('events'),
  util= require('util')
var when= require('when')
var abortSnoop= require('../util/abort-snoop'),
  makePipeline= require('../util/make-pipeline'),
  msgs= require('../wamp/msgs')

module.exports= ClientHelloer

/**
  Accept pipe and build a hello context
*/
function helloDefaults(pipe){
	var hello= {
		pipe: pipe,
		realm: this.realm,
		details: this.details|| {},
		welcome: when.defer()
	}
	hello.details.roles= this.roles
	return hello
}

/**
  Listen for a returning Welcome/Abort, or outgoing Abort
*/
function awaitReply(hello){
	var defer= hello.welcome

	// listen for incoming replies
	var recv= hello.pipe._recv,
	  i= recv.length-1
	while(i >= 0){
		if(recv[i].name == 'emitReceived')
			break
		i--
	}
	if(i == -1)
		i= recv.length-1
	var listenIngress= (function listenIngress(msg){
		if(msg.messageType == msgs.Welcome.messageType && !msg.hello){
			msg.hello= hello
			defer.resolve(msg)
		}
		if(msg.messageType == msgs.Abort.messageType && !msg.hello){
			msg.hello= hello
			defer.reject(msg)
		}
		return msg
	  })
	recv.splice(i, 0, listenIngress)

	// listen for if we send an abort
	var listenOutgress= (function listenOutgress(msg){
		if(msg.messageType == msgs.Abort.messageType && !msg.hello){
			msg.hello= hello
			defer.reject(msg)
		}
		return msg
	})
	var send= hello.pipe._send
	send.splice(send.length-1, 0, listenOutgress)

	// clean up listeners when done
	defer.promise.finally(function(){
		for(var j= recv.length-1; j>= 0; --j){
			if(recv[j] == listenIngress){
				recv.splice(j, 1)
				break
			}
		}
		for(var k= send.length-1; k>= 0; --k){
			if(send[k] == listenOutgress){
				send.splice(k, 1)
				return
			}
		}
	})

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
  Return the promise for the return Welcome
*/
function returnWelcome(hello){
	return hello.welcome.promise
}

/**
  ClientHelloer is a base class that tries to solicit a Welcome by sending a Hello
*/
function ClientHelloer(realm, roles){
	ClientHelloer.super_.call(this)
	var self = this
	this.realm = realm || ''
	this.roles = roles || {caller:{}}

	makePipeline(this, 'sendHello', helloDefaults, awaitReply, sendHello, returnWelcome)
	return this
}
util.inherits(ClientHelloer, events.EventEmitter)
