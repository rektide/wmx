var pipeline2 = require('./pipeline2')

module.exports = makePipeline
module.exports.makePipeline = makePipeline

/**
  Build a pipeline named `slot` on `obj`.
*/
function makePipeline(obj, slot, fns__) {
	var _slot= '_'+slot
	var fns= bj['_'+slot]= Array.prototype.splice.call(arguments, 2)
	obj[slot]= function(a,b,c,d){
		pipeline2(obj[_slot], obj, a, b, c, d)
	}
	for(var i= 0; i< fns.length; ++i){
		fns[i].owner= obj.constructor.name
	}
	return obj[slot]
}
