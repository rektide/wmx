var util= require('util')
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
	var updateConstructor= false
	if(slot){
		var _slot= '_'+slot
		obj[_slot]= pipe
		fn= function(a,b,c,d){
			return pipeline2(obj[_slot], obj, this, a, b, c, d)
		}
		obj[slot]= fn
		if(pipe.length && !obj.constructor[slot]){
			// create constructor links, since we have a pipeline with elements 
			// & no pre-existing links defined on constructor now
			updateConstructor= true
			obj.constructor[slot]= {}
		}
	}else{
		fn= function(a,b,c,d){
			return pipeline2(pipe, obj, this, a, b, c, d)
		}
	}

	// helper: link the pipeline to it's executor
	fn._pipe= pipe

	for(var i= 0; i< pipe.length; ++i){
		var pipeHandler= pipe[i]
		if(!pipeHandler)
			continue

		// helper: assign 'owner' property to all pipeline handlers
		var objName= obj.constructor.name
		if(!pipeHandler.owner && objName)
			pipeHandler.owner= objName

		// create static links on constructor if none exist
		if(updateConstructor){
			// helper: link pipeline helper onto constructor, by index
			obj.constructor[slot][i]= pipeHandler

			// helper: link pipeline handlers onto constructor, by name
			var pipeName= pipeHandler.name
			if(slot && pipeName){
				obj.constructor[slot][pipeName]= pipeHandler
			}
		} // else pipe is anonymous, or has helpers of some variety defined
	}

	return fn
}
