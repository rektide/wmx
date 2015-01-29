/**
  Common means to add entries in to and remove entries from a pipeline
*/
/*function Mixin(){
}

Mixin.prototype.mixInto= function(o){
	for(var i in this.mixes){
		var pipeName= '_'+i
		var mixTarget = this.mixTarget && this.mixTarget[i]
		var src= mixTarget ? o[mixTarget] : o
		var pipeline= src[pipeName]

		var fns = this.mixes[i]
		if(!fns.length)
			fns= [fns]
		for(var j= 0; j < fns.length; ++j){
			var fn= fns[j]
			// not totally comprehensible ordering, v0v
			var pos= fn.mixPos || fns.mixPos || (this.mixPos && this.mixPos[i]) || pipeline.length
			if(pos < 0)
				pos= pipeline.length + pos
			pipeline.splice(pos, 0, fn)
		}
	}
}

Mixin.prototype.mixOutOf= function(o){
	for(var i in this.mixes){
		var pipeName= '_'+i
		var mixTarget = this.mixTarget && this.mixTarget[i]
		var src= mixTarget ? o[mixTarget] : o
		var pipeline= src[pipeName]

		var fns= this.mixes[i]
		if(!fns.length)
			fns= [fns]
		for(var j= 0; j< fns.length ++j){
			var fn= fns[j]
			var k= pipeline.indexOf(fn)
			if(k !== -1)
				pipeline.splice(k, 1)
		}
	}
}
*/


function describe(o){
	var rv= {}
	for(var key of Object.keys(o)){
		var propDesc= Object.getOwnPropertyDescriptor(o, key)	
		if(!propDesc)
			continue
		rv[key]= propDesc
	}
	return rv
}

function getPrototypeChain(o){
	// get all prototypes in the chain
	var cursor= o,
	  rv= []
	while(true){
		if(!(cursor instanceof Object))
			break
		rv.push(cursor)
		cursor = Object.getPrototypeOf(cursor)
		if(cursor.constructor === Function || cursor.constructor === Object)
			break
	}
	return rv
}

function walkChain(protoChain, fn){
	for(var i= protoChain.length-1; i >= 0; --i){
		var src= protoChain[i],
		  names= Object.getOwnPropertyNames(src)
		for(var i of names){
			var name= names[i]
			console.log('op3a:'+key)
			var propDesc= Object.getOwnPropertyDescriptor(src, name)
			fn(propDesc, name, src)
			console.log('op3b')
		}
	}
}

function getPropertyDescriptor(o, prop){
	if(!(o instanceof Array))
		o= getPrototypeChain(o)
	for(var i= 0; i< o.length; ++i){
		var prototype= o[i]
		console.log('op1a')
		var propDesc= Object.getOwnPropertyDescriptor(prototype, prop)
		console.log('op1b:'+!!propDesc)
		if (propDesc)
			return propDesc
	}
}

function apply(src, dest, destChain){
	if(!(src instanceof Array)){
		src= getPrototypeChain(src)
	}
	destChain= destChain|| getPrototypeChain(dest)
	walkChain(src, function(propDesc, key) {
		if(!getPropertyDescriptor(destChain, key)){
			console.log('defineprop:'+key)
			Object.defineProperty(dest, key, propDesc)
		}
	})
	return dest
}

function applier(src){
	if(!(src instanceof Array)){
		src= getPrototypeChain(src)
	}
	return (function apply(dest, destChain){
		apply(src, dest, destChain)
	})
}

function isInstance(o, chain){
	for(var i= 0; i< chain.length; ++i){
		var c= chain[i]
		if(o.constructor == c)
			return true
	}
	return false
}

function mixiner(base){
	console.log('hey')
	var baseChain= getPrototypeChain(base),
	  apply= applier(baseChain)
	console.log('ho')
	return function(o, extra){
		if(!o)
			o= {}
		console.log('apply')
		if(!isInstance(o, baseChain)){
			apply(o)
		}
		console.log('we go')
		for(var i in extra){
			o[i]= extra[i]
		}
		return o
	}
}

module.exports= mixiner
module.exports.apply= apply
module.exports.applier= applier

