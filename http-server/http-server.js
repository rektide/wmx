var emitterMixin= require("emitter-mixin")

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
	// ensure pipe is encoding yada-yada something-or-other
	pipe.on(msgs.Call.messageType, function(){
		console.log("we got a request")
	})
}

module.exports= HttpServer
module.exports.HttpServer= HttpServer
