var HttpServer= require("./http-server")

function createServer(handler){
	return new HttpServer(handler)
}

module.exports= createServer
module.exports.createServer= createServer
