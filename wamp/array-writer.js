var msgs= require("./msgs")

var byId= {}
for(var i in msgs){
	var msg= msgs[i],
	  line= msg.vargs ? ["return o.arguments ? [", msg.messageType] : ["return [",msg.messageType],
	  j= 0
	function writeFields(){
		for(j= 0; j< msg.fields.length; ++j){
			line.push(",o.",msg.fields[j])
		}
	}
	writeFields()
	if(msg.vargs){
		line.push(",o.arguments,o.argumentsKw] : [o.messageType")
		writeFields()
	}
	line.push("]")
	var fn= Function("o", line.join(""))
	byId[msg.messageType]= fn
}

function arrayWriter(msg){
	var fn= byId[msg.messageType]
	return fn ? new fn(msg) : null
}
arrayWriter.owner= "wamp"

function safeArrayWriter(msg){
	return msg.messageType ? byId[msg.messageType](msg) : msg
}
safeArrayWriter.owner= "wamp"

module.exports= arrayWriter
module.exports.arrayWriter= arrayWriter
module.exports.safeArrayWriter= safeArrayWriter
