var msgs= require("./msgs")

var byId= {}
for(var i in msgs){
	var msg= msgs[i],
	  line= ["return [o.messageType"],
	  j= 0
	for(; j< msg.fields.length; ++j){
		line.push(",o.",msg.fields[j])
	}
	if(msg.vargs){
		line.push(",o.arguments,o.argumentsKw")
	}
	line.push("]")
	var fn= Function("o", line.join(""))
	byId[msg.messageType]= fn
}

function arrayWriter(msg){
	if(!msg || !msg[0])
		return
	var fn= byId[msg.messageType]
	return new fn(msg)
}
arrayWriter.owner= "wamp"

function safeArrayWriter(msg){
	return msg.messageType ? byId[msg.messageType](msg) : msg
}
safeArrayWriter.owner= "wamp"

module.exports= arrayWriter
module.exports.arrayWriter= arrayWriter
module.exports.safeArrayWriter= safeArrayWriter
