var isGlobal= require('./is-global')

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
		if(cursor.constructor === Function || cursor.constructor === Object){
			break
		}

	}
	return rv
}


function nop(){}

function walkChain(protoChain, fn){
	for(var i= protoChain.length-1; i >= 0; --i){
		var src= protoChain[i],
		  names= Object.getOwnPropertyNames(src)
		for(var j= 0; j< names.length; ++j){
			var name= names[j]
			if(nop[name] !== undefined)
				continue;
			var propDesc= Object.getOwnPropertyDescriptor(src, name)
			fn(propDesc, name, src)
		}
	}
}


function getPropertyDescriptor(o, prop){
	if(!(o instanceof Array))
		o= getPrototypeChain(o)
	for(var i= 0; i< o.length; ++i){
		var prototype= o[i]
		var propDesc= Object.getOwnPropertyDescriptor(prototype, prop)
		if (propDesc)
			return propDesc
	}
}

function apply(src, dest, destChain){
	if(!(src instanceof Array)){
		src= getPrototypeChain(src)
	}
	destChain= destChain|| getPrototypeChain(dest)
	var diverted
	walkChain(src, function(propDesc, key, src) {
		if(key === 'constructor'){
			return
		}
		if(getPropertyDescriptor(destChain, key)){
			if(!diverted)
				diverted= {}
			diverted[key]= dest[key]
			// perhaps only do this if this is a value, not a complex prop?
			// and check to see whether incoming prop has a setter or no?
		}
		Object.defineProperty(dest, key, propDesc)
	})
	for(var key in diverted){
		dest[key]= diverted[key]
	}
	return dest
}

function applier(src){
	if(!(src instanceof Array)){
		src= getPrototypeChain(src)
	}
	return (function(dest, destChain){
		return apply(src, dest, destChain)
	})
}

function isInstance(o, klass){
	if(!(o instanceof Array)){
		o= getPrototypeChain(o)
	}
	for(var i= 0; i< o.length; ++i){
		var c= o[i]
		if(c.constructor == klass)
			return true
	}
	return false
}

function mixiner(base){
	var baseChain;
	if(base instanceof Array){
		baseChain= base.map(getPrototypeChain)
		baseChain= Array.prototype.concat.apply([], baseChain)
	}else{
		baseChain= getPrototypeChain(base)
	}
	var apply= applier(baseChain)
	return function(o, extra){
		if(this && !isGlobal(this)){
			extra= o
			o= this
		}
		if(!o)
			o= {}
		if(!isInstance(o, baseChain)){
			apply(o)
		}
		console.log('bonus')
		for(var i in extra){
			o[i]= extra[i]
		}
		return o
	}
}

module.exports= mixiner
module.exports.apply= apply
module.exports.applier= applier

