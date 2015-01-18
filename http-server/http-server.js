var emitterMixin= require("emitter-mixin"),
  msgs= require("wmx/wamp/msgs"),
  Request= require("wmx/fetch/request")

function HttpServer(handler){
	if(!this.listen){ // this test could be better oh-kay?
		return new HttpServer(handler)
	}
	if(!this.on) {
		emitterMixin(this)
	}
	if(this.handler && handler)
		throw new Exception("You\"ve got a handler sir/madame/")
	this.handler= handler
}

HttpServer.prototype.listen= function(pipe){
	pipe.on(msgs.Call.messageType, function(msg){
		var opts= msg.options
		if(opts.method && opts.url) {
			Request.mixin(msg)
			this.emit("request", msg)
		}
	})
}

module.exports= HttpServer
module.exports.HttpServer= HttpServer
