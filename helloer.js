var wamp= require('./wamp/msgs')

// modes: maintain only one session, report all
function ClientHelloer(pipe){
	var self = this
	function listener(welcome){
		if(!(welcome instanceof wamp.Welcome))
			return
		pipe.emit('welcomed', welcome.session)
	}
	listener.owner= ClientHelloer
	this.listener= listener

	if(pipe)
		this.addPipe(pipe)
}

ClientHelloer.prototype.addPipe= function(pipe){
	// send a hello
	pipe.send(new wamp.Hello())
	
	// listen for our Welcomes, event
	pipe.addEventListener('message', this.listener)
}

module.exports= ClientHelloer
