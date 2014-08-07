var cloneFunction = require('clone-function')
var pipeline2 = require('./pipeline2')

module.exports = makePipeline
module.exports.makePipeline = makePipeline

/**
  Build a pipeline for `obj`
  @param obj the object to build a pipeline on
  @param slot (optional) a slotname to assign the pipeline to
  @param fns__ (varidac) handlers to use in the pipeline
*/
function makePipeline(obj, slot /*, fns__ */){
	var pipe= Array.prototype.splice.call(arguments, 2)
	var fn
	if(slot){
		var _slot= '_'+slot
		obj[_slot]= pipe
		fn= function(a,b,c,d){
			pipeline2(obj[_slot], obj, a, b, c, d)
		}
	}else{
		fn= function(a,b,c,d){
			pipeline2(pipe, obj, a, b, c, d)
		}
	}

	// helper: link the pipeline to it's executor
	fn._pipe= pipe

	// helper: assign 'owner' property to all pipeline handlers
	for(var i= 0; i< pipe.length; ++i){
		if(!pipe[i].owner)
			pipe[i].owner= obj.constructor.name
	}

	return fn
}
